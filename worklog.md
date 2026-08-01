---
Task ID: 1
Agent: Main Agent
Task: Implement purchase confirmation 2-step flow + auth persistence + sync fixes across both repos

Work Log:
- Added `kycCodeExpiresAt` and `kycCodePurchased` fields to Prisma User model in both repos
- Added missing `sendKycCodeDeliveredEmail` function to TeslaEquity email.ts (rebranded to TeslaEquity)
- Added `confirmPurchase` function + `confirmPurchaseLoading` state to TeslaEquity admin page
- Added "Confirm Purchase & Send" button (green) to user detail header in TeslaEquity
- Added "Confirm Purchase & Send Code to Email" button to user detail KYC section in TeslaEquity
- Updated `quickSendKycCode` in both repos to 2-step flow (generate code only, no email)
- Updated `submitKycGenCode` in both repos to remove stale `notifyUser` field
- Updated `quickSendCodeForRow` in TeslaEquity to use 2-step flow
- Fixed `useAuthStore` in both repos: `isLoading` now starts as `true` when token exists (prevents dashboard flash on refresh)
- Converted `(admin)/layout.tsx` in both repos from server to client component with auth gate (loading spinner until `/api/auth/me` confirms admin role)
- Ran `prisma generate` on both repos after schema changes
- Pushed all changes to both GitHub repos

Stage Summary:
- Both repos now have a complete 2-step KYC code flow: Step 1 = generate code + send purchase warning email; Step 2 = admin confirms purchase + code email sent to client
- Admin layout prevents content flash on refresh with server-side auth verification
- Dashboard loading gate prevents stale content from flashing before API verification
- Tesla Prime pushed: `7a19b42..bcb5024`
- TeslaEquity pushed: `4da7b38..bf3376c`
