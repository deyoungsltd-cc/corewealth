import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// ─── CONFIGURATION ───
// Provider priority (highest first):
//   1. Gmail API (HTTPS)         — set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN
//   2. Resend (HTTPS API)        — set RESEND_API_KEY
//   3. Gmail SMTP (TCP 587)      — set SMTP_EMAIL, SMTP_PASSWORD
//
// NOTE: Railway blocks outbound SMTP on ports 25/465/587 by default.
// If you're on Railway, use Gmail API or Resend — NOT SMTP.
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_EMAIL = process.env.SMTP_EMAIL || 'support@corewealthbank.com';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'CoreWealth Bank';
// IMPORTANT: When using Gmail SMTP, FROM_EMAIL MUST match SMTP_EMAIL
// (Gmail rejects send-as for unverified custom domains).
const FROM_EMAIL = process.env.EMAIL_FROM || SMTP_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

// Gmail API credentials (HTTPS — works from Railway)
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || '';
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || '';
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN || '';

// Determine provider — priority: Gmail API > Resend > SMTP
const USE_GMAIL_API = !!(GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET && GMAIL_REFRESH_TOKEN);
const USE_RESEND = !USE_GMAIL_API && !!RESEND_API_KEY;

// Safety check: Gmail SMTP requires FROM_EMAIL === SMTP_EMAIL
if (!USE_GMAIL_API && !USE_RESEND && SMTP_PASSWORD && FROM_EMAIL !== SMTP_EMAIL) {
  console.warn(`[EMAIL] ⚠️ FROM_EMAIL (${FROM_EMAIL}) differs from SMTP_EMAIL (${SMTP_EMAIL}). Gmail will silently drop these emails. Falling back FROM_EMAIL to SMTP_EMAIL.`);
}
// Force FROM_EMAIL to SMTP_EMAIL when using Gmail SMTP (unless Resend/Gmail API is active)
const SAFE_FROM_EMAIL = (USE_GMAIL_API || USE_RESEND) ? FROM_EMAIL : SMTP_EMAIL;

let _transporter: nodemailer.Transporter | null = null;
let _resendClient: Resend | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    if (!SMTP_PASSWORD) {
      console.warn('[EMAIL] SMTP_PASSWORD not set — emails will be logged but not sent');
    }
    _transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: SMTP_PASSWORD ? { user: SMTP_EMAIL, pass: SMTP_PASSWORD } : undefined,
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 15000,
    });
  }
  return _transporter;
}

function getResendClient(): Resend {
  if (!_resendClient) {
    _resendClient = new Resend(RESEND_API_KEY);
  }
  return _resendClient;
}

export function getEmailConfig() {
  return {
    fromEmail: SAFE_FROM_EMAIL,
    provider: USE_GMAIL_API ? 'gmail-api' : (USE_RESEND ? 'resend' : 'smtp'),
    hasConfig: USE_GMAIL_API ? !!(GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET && GMAIL_REFRESH_TOKEN) : (USE_RESEND ? !!RESEND_API_KEY : !!SMTP_PASSWORD),
    smtpHost: SMTP_HOST,
    smtpPort: SMTP_PORT,
  };
}

// ─── HELPER: Send email via chosen provider (with fallbacks) ───
// Priority: Gmail API (HTTPS) → Resend (HTTPS) → SMTP (TCP, may be blocked by Railway)
// Returns errors from ALL attempted providers so callers can see what failed.
async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; messageId?: string; error?: string; provider?: string; attempts?: Array<{ provider: string; success: boolean; error?: string }> }> {
  const attempts: Array<{ provider: string; success: boolean; error?: string }> = [];

  // 1) Try Gmail API (HTTPS — bypasses Railway SMTP block)
  if (USE_GMAIL_API) {
    try {
      const result = await sendViaGmailApi(to, subject, html);
      if (result.success) {
        console.log(`[EMAIL/GMAIL-API] Sent to ${to}: "${subject}" — id: ${result.messageId}`);
        attempts.push({ provider: 'gmail-api', success: true });
        return { success: true, messageId: result.messageId, provider: 'gmail-api', attempts };
      }
      console.error(`[EMAIL/GMAIL-API] Failed for ${to}: ${result.error}. Falling back to Resend/SMTP...`);
      attempts.push({ provider: 'gmail-api', success: false, error: result.error });
    } catch (error: any) {
      console.error(`[EMAIL/GMAIL-API] Threw for ${to}: ${error?.message || error}. Falling back...`);
      attempts.push({ provider: 'gmail-api', success: false, error: error?.message || String(error) });
    }
  }

  // 2) Try Resend (HTTPS API)
  if (USE_RESEND) {
    try {
      const client = getResendClient();
      // CRITICAL: Resend SDK returns { data, error } and does NOT throw on failure.
      const { data, error } = await client.emails.send({
        from: `"${FROM_NAME}" <${SAFE_FROM_EMAIL}>`,
        to: [to],
        subject,
        html,
      }) as { data: { id?: string } | null; error: { message?: string; name?: string } | null };

      if (error) {
        console.error(`[EMAIL/RESEND] API returned error for ${to}: ${error.name || 'Error'} — ${error.message || JSON.stringify(error)}. Falling back to SMTP...`);
        attempts.push({ provider: 'resend', success: false, error: `${error.name || 'Error'}: ${error.message || JSON.stringify(error)}` });
      } else if (data?.id) {
        console.log(`[EMAIL/RESEND] Sent to ${to}: "${subject}" — id: ${data.id}`);
        attempts.push({ provider: 'resend', success: true });
        return { success: true, messageId: data.id, provider: 'resend', attempts };
      } else {
        console.error(`[EMAIL/RESEND] Unexpected response for ${to}: ${JSON.stringify(data)}. Falling back to SMTP...`);
        attempts.push({ provider: 'resend', success: false, error: `Unexpected response: ${JSON.stringify(data)}` });
      }
    } catch (error: any) {
      console.error(`[EMAIL/RESEND] Threw error sending to ${to}: ${error?.message || error}. Falling back to SMTP...`);
      attempts.push({ provider: 'resend', success: false, error: error?.message || String(error) });
    }
  }

  // 3) Fall back to SMTP (likely blocked on Railway — see email-debug endpoint)
  const transporter = getTransporter();

  if (!SMTP_PASSWORD) {
    console.warn(`[EMAIL] No provider succeeded and SMTP_PASSWORD not set. Would have sent to ${to}: "${subject}"`);
    return {
      success: false,
      error: 'No email provider available (Gmail API, Resend, or SMTP not configured)',
      provider: 'none',
      attempts,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${SMTP_EMAIL}>`,
      to,
      subject,
      html,
      envelope: { from: SMTP_EMAIL, to },
    });
    console.log(`[EMAIL/SMTP] Sent to ${to}: "${subject}" — messageId: ${info.messageId}, response: ${info.response}`);
    attempts.push({ provider: 'smtp', success: true });
    return { success: true, messageId: info.messageId, provider: 'smtp', attempts };
  } catch (error: any) {
    console.error(`[EMAIL/SMTP] Failed to send to ${to}:`, error?.message || error);
    console.error(`[EMAIL/SMTP] Error code: ${error?.code}, responseCode: ${error?.responseCode}, command: ${error?.command}`);
    attempts.push({ provider: 'smtp', success: false, error: `${error?.code || 'Error'}: ${error?.message || String(error)}` });
    return {
      success: false,
      error: error?.message || String(error),
      provider: 'smtp-failed',
      attempts,
    };
  }
}

// ─── GMAIL API (HTTPS) — bypasses Railway SMTP block ───
// Uses OAuth2 refresh token to get an access token, then sends via gmail.users.messages.send
// Requires GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN env vars
let _cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getGmailAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (_cachedAccessToken && _cachedAccessToken.expiresAt > Date.now() + 60000) {
    return _cachedAccessToken.token;
  }

  const body = new URLSearchParams({
    client_id: GMAIL_CLIENT_ID,
    client_secret: GMAIL_CLIENT_SECRET,
    refresh_token: GMAIL_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAuth token refresh failed (${res.status}): ${text}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  _cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  };
  return data.access_token;
}

async function sendViaGmailApi(to: string, subject: string, html: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const accessToken = await getGmailAccessToken();

  // Build RFC 822 message
  const fromHeader = `From: "${FROM_NAME}" <${SMTP_EMAIL}>`;
  const toHeader = `To: ${to}`;
  const subjectHeader = `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const mimeVersion = 'MIME-Version: 1.0';
  const contentType = 'Content-Type: text/html; charset=UTF-8';
  const contentTransferEncoding = 'Content-Transfer-Encoding: base64';

  const rawMessage = `${fromHeader}\r\n${toHeader}\r\n${subjectHeader}\r\n${mimeVersion}\r\n${contentType}\r\n${contentTransferEncoding}\r\n\r\n${html}`;
  const raw = Buffer.from(rawMessage).toString('base64url');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: `Gmail API ${res.status}: ${text}` };
  }

  const data = await res.json() as { id: string };
  return { success: true, messageId: data.id };
}

// ─── PRE-LOAD LOGO ───
// NOTE: Gmail (and most modern email clients) silently strips base64-embedded
// images for security reasons. We must use a publicly-accessible HTTPS URL
// for the logo instead.
//
// DOMAIN: corewealthbank.com (live and verified serving the Next.js app)
// Logo loads from your custom domain — looks professional, no Railway URL
// visible in email image sources.
//
// LOGO STRATEGY (Gmail-friendly):
//   - Use optimized PNG (192x192, ~25KB) — small enough for Gmail's image proxy
//   - Filename `email-logo-v2.png` is fresh (busts Gmail's cached failed fetch
//     from when we served a 1024x1024 JPG)
//   - Per-send timestamp nonce guarantees Gmail never serves a cached image
//   - Alt text is EMPTY so a failed image load shows nothing (the styled brand
//     text below the image carries the brand identity regardless)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://corewealthbank.com';
// Logo URL — no query string (some email proxies mishandle ?param=value)
// Path-based versioning via filename `email-logo-v2.png` is sufficient.
// If we need to bust cache in the future, rename to v3.png.
function getLogoUrl(): string {
  return `${APP_URL}/email-logo-v2.png`;
}

// ============================================================
// SHARED TEMPLATE BUILDERS — Premium CoreWealth-branded design
// Color system:
//   Brand red: #B91C1C (deep crimson — looks sophisticated, not orange)
//   Background: pure black #000000 → #0a0a0a
//   Text: #FFFFFF / #888888 / #555555 / #333333
//   All gradients removed — Gmail renders them as orange-tinted
// ============================================================

function logoHtml(): string {
  // PURE HTML/CSS LOGO MARK — no external image dependency.
  //
  // Gmail's image proxy is unreliable for new domains (caches failed fetches,
  // may block fresh domains, etc.). Instead of fighting it, we render a
  // premium logo mark using pure HTML + CSS that ALWAYS renders, regardless
  // of email client image loading settings, proxy behavior, or network issues.
  //
  // Design: CoreWealth-style "T" mark
  //   - Black background with deep crimson border
  //   - Stylized "T" rendered using a horizontal bar + vertical stem
  //   - Premium rounded corners, sophisticated spacing
  //
  // This is the same approach major brands (Apple, Stripe, Linear) use in
  // transactional emails — pure HTML/CSS logo marks are 100% reliable.
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 20px"><tr><td style="width:72px;height:72px;background-color:#000000;border:1.5px solid #B91C1C;border-radius:16px;position:relative;overflow:hidden;text-align:center;vertical-align:middle;line-height:72px;font-size:42px;font-weight:900;color:#7C3AED;font-family:'Helvetica Neue',Arial,sans-serif;letter-spacing:-2px">T</td></tr></table>`;
}

function headerBlock(): string {
  // Premium header design:
  //   1. Pure CSS logo mark (CoreWealth-style T) — always renders, no image dependency
  //   2. Brand wordmark "COREWEALTH BANK" — styled text
  //   3. Tagline + accent divider
  // No external image = nothing to fail loading. Gmail can never break this.
  return `
    <div style="background-color:#000000;padding:48px 32px 36px;text-align:center;border-bottom:1px solid #B91C1C">
      ${logoHtml()}
      <h1 style="color:#ffffff;margin:0;font-size:18px;font-weight:700;letter-spacing:5px;font-family:'Helvetica Neue',Arial,sans-serif">COREWEALTH BANK</h1>
      <p style="color:#B91C1C;margin:12px 0 0;font-size:9px;letter-spacing:5px;text-transform:uppercase;font-weight:600;font-family:'Helvetica Neue',Arial,sans-serif">Premium Investment Platform</p>
      <div style="width:32px;height:1px;background-color:#B91C1C;margin:16px auto 0"></div>
    </div>`;
}

function otpBlock(otp: string, expiresIn: string): string {
  // Premium card with shield icon, refined red accent, monospace OTP
  return `
    <div style="background-color:#0a0a0a;border:1px solid #1f1f1f;border-left:3px solid #B91C1C;border-radius:6px;padding:32px 28px;text-align:center;margin:32px 0">
      <div style="margin:0 0 20px;display:inline-block">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle">
          <path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z" stroke="#B91C1C" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke="#B91C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p style="color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:3px;margin:0 0 20px;font-weight:600;font-family:'Helvetica Neue',Arial,sans-serif">Your Verification Code</p>
      <div style="font-size:34px;font-weight:700;color:#ffffff;letter-spacing:14px;font-family:'SF Mono',Monaco,'Cascadia Code','Roboto Mono',Menlo,monospace;display:block;padding:0 0 4px;text-indent:14px">${otp}</div>
      <div style="width:80px;height:1px;background-color:#1a1a1a;margin:20px auto"></div>
      <p style="color:#B91C1C;font-size:10px;margin:0;font-weight:600;letter-spacing:1px;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif">Expires in ${expiresIn}</p>
    </div>`;
}

function ctaButton(text: string, url: string): string {
  return `
    <div style="text-align:center;margin:32px 0">
      <a href="${url}" style="display:inline-block;background-color:#B91C1C;color:#ffffff;padding:16px 44px;border-radius:4px;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif">${text}</a>
    </div>`;
}

function footerBlock(): string {
  const year = new Date().getFullYear();
  return `
    <div style="background-color:#000000;padding:32px 32px 28px;text-align:center;border-top:1px solid #1a1a1a">
      <p style="color:#666666;font-size:11px;margin:0 0 12px;font-weight:700;letter-spacing:3px;font-family:'Helvetica Neue',Arial,sans-serif">COREWEALTH BANK</p>
      <div style="width:24px;height:1px;background-color:#B91C1C;margin:0 auto 16px"></div>
      <p style="color:#444444;font-size:10px;margin:0 0 16px;line-height:1.7;letter-spacing:0.5px">
        Professionally managed investment platform<br>
        Daily returns up to 1.8% across diversified strategies
      </p>
      <p style="color:#333333;font-size:9px;margin:0;line-height:1.6;letter-spacing:0.5px">
        &copy; ${year} CoreWealth Bank. All rights reserved.<br>
        This is an automated message — please do not reply to this email.
      </p>
    </div>`;
}

function emailWrapper(innerHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"></head>
    <body style="margin:0;padding:0;background-color:#000000;font-family:'Helvetica Neue','Segoe UI',Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;min-height:100vh">
        <tr><td align="center" style="padding:32px 16px">
          <table role="presentation" width="540" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border-radius:8px;overflow:hidden;border:1px solid #1a1a1a;box-shadow:0 4px 32px rgba(0,0,0,0.5)">
            ${innerHtml}
          </table>
          <p style="color:#1a1a1a;font-size:9px;margin:20px 0 0;text-align:center;letter-spacing:2px;text-transform:uppercase">CoreWealth Bank &mdash; Invest with Confidence</p>
        </td></tr>
      </table>
    </body>
    </html>`;
}

function contentArea(bodyHtml: string): string {
  return `<div style="padding:36px 32px">${bodyHtml}</div>`;
}

// ============================================================
// EMAIL FUNCTIONS
// ============================================================

export async function sendVerificationEmail(to: string, otp: string, name?: string) {
  const greeting = name ? `Hello ${name}` : 'Hello';
  console.log(`[EMAIL] Sending verification OTP to ${to}, code: ${otp}, from: ${SAFE_FROM_EMAIL}`);

  const body = contentArea(`
    <p style="color:#ffffff;font-size:14px;margin:0 0 16px;font-weight:500;letter-spacing:0.5px">${greeting},</p>
    <p style="color:#888888;font-size:13px;margin:0 0 4px;line-height:1.8;letter-spacing:0.3px">Thank you for opening an account with CoreWealth Bank. To complete your registration and activate your investment portfolio, please enter the verification code below:</p>
    ${otpBlock(otp, '10 minutes')}
    <p style="color:#555555;font-size:11px;margin:0;line-height:1.8;letter-spacing:0.3px">Enter this code on the verification page to activate your account. If you did not request this account, you can safely ignore this email — no action is required.</p>
  `);

  const html = emailWrapper(headerBlock() + body + footerBlock());
  return sendEmail(to, 'Your Verification Code — CoreWealth Bank', html);
}

export async function sendPasswordResetEmail(to: string, otp: string, name?: string) {
  const greeting = name ? `Hello ${name}` : 'Hello';
  console.log(`[EMAIL] Sending password reset OTP to ${to}, code: ${otp}, from: ${SAFE_FROM_EMAIL}`);

  const body = contentArea(`
    <p style="color:#ffffff;font-size:14px;margin:0 0 16px;font-weight:500;letter-spacing:0.5px">${greeting},</p>
    <p style="color:#888888;font-size:13px;margin:0 0 4px;line-height:1.8;letter-spacing:0.3px">We received a request to reset the password on your CoreWealth Bank account. Use the verification code below to set a new password:</p>
    ${otpBlock(otp, '15 minutes')}
    <p style="color:#555555;font-size:11px;margin:0;line-height:1.8;letter-spacing:0.3px">If you did not request a password reset, please ignore this email — your password will remain unchanged and your account is secure.</p>
  `);

  const html = emailWrapper(headerBlock() + body + footerBlock());
  return sendEmail(to, 'Password Reset Code — CoreWealth Bank', html);
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const greeting = name ? `Dear ${name}` : 'Welcome';
  console.log(`[EMAIL] Sending welcome email to ${to}, from: ${SAFE_FROM_EMAIL}`);
  // Use custom domain for all links
  const appUrl = APP_URL;

  const body = contentArea(`
    <p style="color:#ffffff;font-size:14px;margin:0 0 16px;font-weight:500;letter-spacing:0.5px">${greeting},</p>
    <p style="color:#888888;font-size:13px;margin:0 0 24px;line-height:1.8;letter-spacing:0.3px">Your CoreWealth Bank account has been successfully created and verified. Welcome to a premium investment experience built around transparency, performance, and security.</p>
    <div style="background-color:#0a0a0a;border:1px solid #1a1a1a;border-left:3px solid #B91C1C;border-radius:6px;padding:24px 28px;margin:0 0 28px">
      <p style="color:#B91C1C;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;font-family:'Helvetica Neue',Arial,sans-serif">What's Next?</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;color:#666666;font-size:12px;width:24px;vertical-align:top">01</td>
          <td style="padding:6px 0;color:#cccccc;font-size:13px;line-height:1.6;letter-spacing:0.3px">Choose an investment plan matched to your financial goals</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#666666;font-size:12px;vertical-align:top">02</td>
          <td style="padding:6px 0;color:#cccccc;font-size:13px;line-height:1.6;letter-spacing:0.3px">Fund your account via bank transfer or wire</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#666666;font-size:12px;vertical-align:top">03</td>
          <td style="padding:6px 0;color:#cccccc;font-size:13px;line-height:1.6;letter-spacing:0.3px">Watch your capital grow with daily returns, paid in real time</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#666666;font-size:12px;vertical-align:top">04</td>
          <td style="padding:6px 0;color:#cccccc;font-size:13px;line-height:1.6;letter-spacing:0.3px">Withdraw your profits on demand, processed within minutes</td>
        </tr>
      </table>
    </div>
    ${ctaButton('Sign In to Your Account', `${appUrl}/login`)}
    <p style="color:#555555;font-size:11px;margin:20px 0 0;line-height:1.7;letter-spacing:0.3px">If you have any questions, our client services team is available 24/7 through the platform.</p>
  `);

  const html = emailWrapper(headerBlock() + body + footerBlock());
  return sendEmail(to, 'Welcome to CoreWealth Bank — Account Activated', html);
}

export async function sendAdminNotificationEmail(to: string, name: string, options: {
  type: 'kyc_approved' | 'kyc_rejected' | 'deposit_confirmed' | 'deposit_rejected' | 'withdrawal_approved' | 'withdrawal_rejected';
  title: string;
  message: string;
  amount?: string;
  adminMessage?: string;
  attachmentUrl?: string;
}) {
  const { type, title, message, amount, adminMessage, attachmentUrl } = options;
  const greeting = name ? `Hi ${name}` : 'Hello';

  const typeConfig: Record<string, { color: string; bgColor: string; icon: string; label: string }> = {
    kyc_approved: { color: '#22C55E', bgColor: '#0a1f0f', icon: '&#10003;', label: 'APPROVED' },
    kyc_rejected: { color: '#EF4444', bgColor: '#1f0a0a', icon: '&#10007;', label: 'REJECTED' },
    deposit_confirmed: { color: '#22C55E', bgColor: '#0a1f0f', icon: '&#10003;', label: 'CONFIRMED' },
    deposit_rejected: { color: '#EF4444', bgColor: '#1f0a0a', icon: '&#10007;', label: 'REJECTED' },
    withdrawal_approved: { color: '#22C55E', bgColor: '#0a1f0f', icon: '&#10003;', label: 'APPROVED' },
    withdrawal_rejected: { color: '#EF4444', bgColor: '#1f0a0a', icon: '&#10007;', label: 'REJECTED' },
  };
  const cfg = typeConfig[type] || { color: '#7C3AED', bgColor: '#1f0a0a', icon: '&#9733;', label: 'NOTICE' };

  const body = contentArea(`
    <p style="color:#ffffff;font-size:14px;margin:0 0 24px;font-weight:500;letter-spacing:0.5px">${greeting},</p>
    <div style="text-align:center;margin:0 0 24px">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:${cfg.bgColor};border:1px solid ${cfg.color};text-align:center;line-height:54px;font-size:24px;color:${cfg.color};box-shadow:0 0 0 4px rgba(204,0,0,0.05)">${cfg.icon}</div>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <span style="display:inline-block;color:${cfg.color};font-size:9px;font-weight:700;letter-spacing:3px;padding:6px 14px;border:1px solid ${cfg.color};border-radius:3px;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif">${cfg.label}</span>
    </div>
    <h2 style="color:#ffffff;text-align:center;font-size:18px;margin:0 0 16px;font-weight:700;letter-spacing:0.5px;font-family:'Helvetica Neue',Arial,sans-serif">${title}</h2>
    <p style="color:#888888;font-size:13px;margin:0 0 24px;line-height:1.8;text-align:center;letter-spacing:0.3px">${message}</p>
    ${amount ? `<div style="background:#0a0a0a;border:1px solid #1a1a1a;border-left:3px solid ${cfg.color};border-radius:8px;padding:24px;text-align:center;margin:0 0 24px">
      <p style="color:#666666;font-size:9px;text-transform:uppercase;letter-spacing:3px;margin:0 0 12px;font-weight:600;font-family:'Helvetica Neue',Arial,sans-serif">Amount</p>
      <span style="font-size:28px;font-weight:700;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;letter-spacing:1px">${amount}</span>
    </div>` : ''}
    ${adminMessage ? `<div style="background:#0a0a0a;border:1px solid #1a1a1a;border-left:3px solid #F59E0B;border-radius:8px;padding:20px 24px;margin:0 0 24px">
      <p style="color:#F59E0B;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;font-family:'Helvetica Neue',Arial,sans-serif">Message from CoreWealth Bank</p>
      <p style="color:#cccccc;font-size:13px;margin:0;line-height:1.8;letter-spacing:0.3px">${adminMessage}</p>
    </div>` : ''}
    ${attachmentUrl ? ctaButton('View Attachment', attachmentUrl) : ''}
    <p style="color:#555555;font-size:11px;margin:20px 0 0;line-height:1.7;text-align:center;letter-spacing:0.3px">If you have any questions, contact our client services team or visit your dashboard for more details.</p>
  `);

  const html = emailWrapper(headerBlock() + body + footerBlock());
  return sendEmail(to, `${title} — CoreWealth Bank`, html);
}

// ── KYC Verification Code Required Email ──
export async function sendKycCodeRequiredEmail(to: string, name: string, options: {
  adminMessage?: string;
}) {
  const { adminMessage } = options;
  const greeting = name ? `Hello ${name}` : 'Hello';

  const body = contentArea(`
    <p style="color:#ffffff;font-size:14px;margin:0 0 24px;font-weight:500;letter-spacing:0.5px">${greeting},</p>
    <div style="text-align:center;margin:0 0 24px">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#1f0a0a;border:1px solid #7C3AED;text-align:center;line-height:54px;font-size:24px;color:#7C3AED;box-shadow:0 0 0 4px rgba(204,0,0,0.05)">&#9733;</div>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <span style="display:inline-block;color:#7C3AED;font-size:9px;font-weight:700;letter-spacing:3px;padding:6px 14px;border:1px solid #7C3AED;border-radius:3px;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif">ACTION REQUIRED</span>
    </div>
    <h2 style="color:#ffffff;text-align:center;font-size:18px;margin:0 0 16px;font-weight:700;letter-spacing:0.5px;font-family:'Helvetica Neue',Arial,sans-serif">KYC Verification Code Required</h2>
    <p style="color:#888888;font-size:13px;margin:0 0 24px;line-height:1.8;text-align:center;letter-spacing:0.3px">
      To proceed with your KYC verification, you are required to obtain a KYC Verification Code from our administration team.
    </p>
    <div style="background:#0a0a0a;border:1px solid #1a1a1a;border-left:3px solid #7C3AED;border-radius:8px;padding:24px;margin:0 0 24px">
      <p style="color:#7C3AED;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;font-family:'Helvetica Neue',Arial,sans-serif">How to Get Your Code</p>
      <p style="color:#cccccc;font-size:13px;margin:0 0 12px;line-height:1.8;letter-spacing:0.3px">
        Contact our support team through either of the following channels:
      </p>
      <ul style="color:#cccccc;font-size:13px;margin:0;padding:0 0 0 20px;line-height:2;letter-spacing:0.3px">
        <li><strong style="color:#ffffff">Live Chat:</strong> Use the chat widget on your dashboard</li>
        <li><strong style="color:#ffffff">Email:</strong> ${SAFE_FROM_EMAIL}</li>
      </ul>
    </div>
    <div style="background:#0a0a0a;border:1px solid #1a1a1a;border-left:3px solid #F59E0B;border-radius:8px;padding:20px 24px;margin:0 0 24px">
      <p style="color:#F59E0B;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;font-family:'Helvetica Neue',Arial,sans-serif">Important</p>
      <p style="color:#cccccc;font-size:13px;margin:0;line-height:1.8;letter-spacing:0.3px">
        You will not be able to submit KYC documents until you enter a valid verification code. This is a mandatory step to ensure the security and integrity of your account verification process.
      </p>
    </div>
    ${adminMessage ? `<div style="background:#0a0a0a;border:1px solid #1a1a1a;border-left:3px solid #22C55E;border-radius:8px;padding:20px 24px;margin:0 0 24px">
      <p style="color:#22C55E;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;font-family:'Helvetica Neue',Arial,sans-serif">Message from Support</p>
      <p style="color:#cccccc;font-size:13px;margin:0;line-height:1.8;letter-spacing:0.3px">${adminMessage}</p>
    </div>` : ''}
    <p style="color:#555555;font-size:11px;margin:20px 0 0;line-height:1.7;text-align:center;letter-spacing:0.3px">If you have any questions, our support team is available 24/7 to assist you.</p>
  `);

  const html = emailWrapper(headerBlock() + body + footerBlock());
  return sendEmail(to, 'KYC Verification Code Required — CoreWealth Bank', html);
}

// ── KYC Verification Code Delivered Email ──
export async function sendKycCodeDeliveredEmail(to: string, name: string, options: {
  code: string;
  adminMessage?: string;
}) {
  const { code, adminMessage } = options;
  const greeting = name ? `Hello ${name}` : 'Hello';

  const body = contentArea(`
    <p style="color:#ffffff;font-size:14px;margin:0 0 24px;font-weight:500;letter-spacing:0.5px">${greeting},</p>
    <div style="text-align:center;margin:0 0 24px">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:#0a1a0a;border:1px solid #22C55E;text-align:center;line-height:54px;font-size:24px;color:#22C55E;box-shadow:0 0 0 4px rgba(34,197,94,0.05)">&#10003;</div>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <span style="display:inline-block;color:#22C55E;font-size:9px;font-weight:700;letter-spacing:3px;padding:6px 14px;border:1px solid #22C55E;border-radius:3px;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif">CODE ISSUED</span>
    </div>
    <h2 style="color:#ffffff;text-align:center;font-size:18px;margin:0 0 16px;font-weight:700;letter-spacing:0.5px;font-family:'Helvetica Neue',Arial,sans-serif">Your KYC Verification Code</h2>
    <p style="color:#888888;font-size:13px;margin:0 0 24px;line-height:1.8;text-align:center;letter-spacing:0.3px">
      Your KYC Verification Code has been issued by our admin team. Please use this code to complete your Level 1 KYC verification on the platform.
    </p>
    <div style="background:#0a0a0a;border:2px solid #22C55E;border-radius:12px;padding:28px;margin:0 0 24px;text-align:center">
      <p style="color:#22C55E;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;font-family:'Helvetica Neue',Arial,sans-serif">Your Verification Code</p>
      <p style="color:#ffffff;font-size:28px;font-weight:700;letter-spacing:6px;margin:0;font-family:'Courier New',monospace">${code}</p>
    </div>
    <div style="background:#0a0a0a;border:1px solid #1a1a1a;border-left:3px solid #3B82F6;border-radius:8px;padding:20px 24px;margin:0 0 24px">
      <p style="color:#3B82F6;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;font-family:'Helvetica Neue',Arial,sans-serif">How to Use This Code</p>
      <ol style="color:#cccccc;font-size:13px;margin:0;padding:0 0 0 20px;line-height:2.2;letter-spacing:0.3px">
        <li>Go to the <strong style="color:#ffffff">KYC Verification</strong> page on your dashboard</li>
        <li>Upload your ID documents (front and back)</li>
        <li>Enter this code when prompted</li>
        <li>Submit your documents for review</li>
      </ol>
    </div>
    ${adminMessage ? `<div style="background:#0a0a0a;border:1px solid #1a1a1a;border-left:3px solid #7C3AED;border-radius:8px;padding:20px 24px;margin:0 0 24px">
      <p style="color:#7C3AED;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;font-family:'Helvetica Neue',Arial,sans-serif">Message from Admin</p>
      <p style="color:#cccccc;font-size:13px;margin:0;line-height:1.8;letter-spacing:0.3px">${adminMessage}</p>
    </div>` : ''}
    <div style="background:#0a0a0a;border:1px solid #1a1a1a;border-left:3px solid #F59E0B;border-radius:8px;padding:20px 24px;margin:0 0 24px">
      <p style="color:#F59E0B;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;font-family:'Helvetica Neue',Arial,sans-serif">Security Notice</p>
      <p style="color:#cccccc;font-size:13px;margin:0;line-height:1.8;letter-spacing:0.3px">
        This code is for your use only. Do not share it with anyone. If you did not request this code, please contact support immediately.
      </p>
    </div>
    <p style="color:#555555;font-size:11px;margin:20px 0 0;line-height:1.7;text-align:center;letter-spacing:0.3px">If you have any questions, our support team is available 24/7 to assist you.</p>
  `);

  const html = emailWrapper(headerBlock() + body + footerBlock());
  return sendEmail(to, 'Your KYC Verification Code — CoreWealth Bank', html);
}
