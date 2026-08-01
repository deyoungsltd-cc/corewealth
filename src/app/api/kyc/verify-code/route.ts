import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, apiResponse, apiError } from '@/lib/api-helpers';
import { z } from 'zod';

const VerifySchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

async function handler(request: NextRequest, _context: any, user: any) {
  try {
    const body = await request.json();
    const parsed = VerifySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || 'Invalid input', 'VALIDATION_ERROR', 400);
    }

    const { code } = parsed.data;
    const trimmedCode = code.trim().toUpperCase();

    // Check if user has a KYC verification code set
    const storedCode = user.kycVerificationCode;
    if (!storedCode) {
      return apiError('No verification code required', 'NO_CODE_REQUIRED', 400);
    }

    // Compare codes (case-insensitive)
    if (trimmedCode !== storedCode.trim().toUpperCase()) {
      return apiError('Invalid verification code', 'INVALID_CODE', 401);
    }

    // Code matches — clear it from the user record
    await db.user.update({
      where: { id: user.id },
      data: { kycVerificationCode: null },
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'kyc_submitted',
        title: 'KYC Verification Complete',
        message: 'Your verification code was accepted. Your KYC documents will now be reviewed by our team.',
      },
    });

    return apiResponse({
      message: 'Verification code accepted. Your KYC submission is now being reviewed.',
    });
  } catch (error) {
    console.error('KYC verify code error:', error);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}

export const POST = requireAuth(handler);
