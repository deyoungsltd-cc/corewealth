import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateOtpCode } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import { requireAuth, apiResponse, apiError } from '@/lib/api-helpers';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const actionSchema = z.object({
  email: z.string().email(),
  action: z.string().min(1),
});

// Global shared OTP store (shared with confirm route via globalThis)
const globalOtpStore = (globalThis as any).__verifyActionOtpStore || new Map<string, { otp: string; expiresAt: number }>();
(globalThis as any).__verifyActionOtpStore = globalOtpStore;

// Clean expired entries periodically
function cleanExpired() {
  const now = Date.now();
  for (const [key, val] of globalOtpStore.entries()) {
    if (val.expiresAt < now) globalOtpStore.delete(key);
  }
}

async function postHandler(request: NextRequest, _context: any, user: any) {
  const rl = rateLimit(request, true);
  if (!rl.success) {
    return NextResponse.json(
      { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests. Try again in 1 minute.' } },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  try {
    const body = await request.json();
    const parsed = actionSchema.safeParse(body);

    if (!parsed.success) {
      return apiError('Invalid request', 'VALIDATION_ERROR', 400);
    }

    const { email, action } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Verify the email belongs to the authenticated user
    if (normalizedEmail !== user.email) {
      return apiError('Email does not match your account', 'FORBIDDEN', 403);
    }

    // Generate OTP (5 min expiry)
    cleanExpired();
    const otp = generateOtpCode();
    const storeKey = `${normalizedEmail}:${action}`;
    globalOtpStore.set(storeKey, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Send email
    if (process.env.SMTP_PASSWORD) {
      try {
        const firstName = user.profile?.firstName;
        await sendVerificationEmail(normalizedEmail, otp, firstName);
      } catch (emailErr) {
        console.error('[VERIFY-ACTION] Failed to send OTP email:', emailErr);
      }
    } else {
      console.log(`[VERIFY-ACTION] Email not configured — OTP ${otp} for ${normalizedEmail} action: ${action}`);
    }

    return apiResponse({ message: 'Verification code sent to your email' });
  } catch (error: any) {
    console.error('[VERIFY-ACTION] Error:', error);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}

export const POST = requireAuth(postHandler);
