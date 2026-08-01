#!/usr/bin/env node
/**
 * Generate the Gmail OAuth consent URL for teslaprimesupportt@gmail.com.
 * User opens this URL, signs in, authorizes, then pastes back the
 * redirected URL containing ?code=4/0AanRRr...
 *
 * Usage:
 *   GMAIL_CLIENT_ID=xxxx.apps.googleusercontent.com \
 *   node scripts/gen-oauth-url.js
 */

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:3001/callback';
const SCOPE = 'https://mail.google.com/';

if (!CLIENT_ID) {
  console.error('❌ Missing GMAIL_CLIENT_ID env var');
  process.exit(1);
}

const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
url.searchParams.set('client_id', CLIENT_ID);
url.searchParams.set('redirect_uri', REDIRECT_URI);
url.searchParams.set('response_type', 'code');
url.searchParams.set('scope', SCOPE);
url.searchParams.set('access_type', 'offline');
url.searchParams.set('prompt', 'consent');  // force consent to get fresh refresh_token

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  Gmail OAuth — for teslaprimesupportt@gmail.com');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log('Open this URL in your browser:\n');
console.log(url.toString());
console.log('\n--- Instructions ---');
console.log('1. Sign in as teslaprimesupportt@gmail.com (NOT teslaequity.support)');
console.log('2. If you see "Google hasn\'t verified this app":');
console.log('   click "Advanced" → "Go to TeslaEquity (unsafe)"');
console.log('3. Click "Allow" to grant Gmail send permission');
console.log('4. Browser will try to open localhost:3001 — page WILL NOT LOAD');
console.log('   (that\'s expected, no server running locally)');
console.log('5. Copy the ENTIRE URL from your browser\'s address bar');
console.log('6. Paste it back to me in the chat\n');
