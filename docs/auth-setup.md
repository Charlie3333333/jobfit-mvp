# Email accounts and verification

## Current access mode

Authentication is temporarily disabled at the user's request. With
`NEXT_PUBLIC_AUTH_ENABLED=false` (the default), the workspace and job-focus API
work without a login, account navigation is hidden, and old authentication URLs
redirect to the workspace. No Supabase account data is loaded in this mode.
Guest drafts use the existing browser-local guest storage; account-scoped drafts
remain untouched. This does not enable cloud sync or deploy changes to Vercel.
Set the flag to `true` explicitly to restore the authentication flows below.

BestFit uses Supabase Auth for email/password accounts and email verification.
Passwords and verification codes are handled by Supabase, never by the resume
storage code. No service-role or secret API key is needed by this integration.

## Connect the project

1. Create a Supabase project. The BestFit development project has been created
   and its public connection settings are saved in the ignored `.env.local`.
2. Copy `.env.example` to `.env.local` and fill in the Project URL and
   **publishable** key from the Supabase Connect dialog.
3. Add those same two environment variables to the Vercel project before the
   next deployment. Restart local development after changing environment values.
4. In Authentication, enable Email/password signups and **Confirm email**.
   Set minimum password length to at least 8 characters.
5. For the current local-only setup, Site URL is `http://localhost:3000`.
   The user approved and the dashboard has saved only these redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://127.0.0.1:3000/auth/callback`
   Do not add the production address or change Site URL to production without
   the user's approval. Production authentication has not been configured.
6. Configure a custom SMTP sender first: the current Free dashboard requires
   custom SMTP to edit email templates. Then in Authentication > Emails, use the confirmation and reset templates
   in this folder. They include `{{ .Token }}` so users can enter a code on the
   website. The SDK performs verification; the UI does not generate any codes.
7. Configure a verified SMTP sender for delivery to real users. Supabase's
   built-in sender is restricted and not suitable for a public signup launch.
   Resend SMTP is now configured with its test sender `onboarding@resend.dev`.
   The user entered the sending-only credential directly in Supabase; it is not
   stored in this repository. Confirmation and recovery code templates have
   been saved in the dashboard. Delivery is restricted to the Resend account's
   own email until a sending domain is verified. Actual delivery and complete
   signup/recovery flows still need testing; this is not a public signup launch.

## Routes and behavior

- `/login`: password login; unconfirmed users can request a new signup code.
- `/signup`: signup, email code verification, and 60-second resend cooldown.
- `/forgot-password`: email recovery code, followed by new password entry.
- `/reset-password`: handles recovery links that use the PKCE callback.
- `/auth/callback`: exchanges the one-time PKCE code for session cookies.
- With Supabase configured, `/studio`, `/profile`, `/experiences`, and
  `/reset-password` require a server-validated session. The API separately checks
  the authenticated user. Redirect targets are restricted to known local pages.
- Without configuration, public previews remain usable and auth forms show a
  setup notice with disabled submit buttons. The job-focus API returns 503.
- Drafts remain **local to the browser**, with separate storage keys per account.
  Login does not yet provide cloud storage or cross-device sync.
- Existing anonymous drafts stay in their original browser storage. They are
  not silently assigned to a newly signed-in account. A future import action can
  migrate these drafts with the user's choice.

## Verify after configuration

Use a test inbox you control to complete signup, invalid/expired-code handling,
resend cooldown, login with correct/wrong passwords, recovery, signout, and
session expiry. Verify protected pages/API reject requests without cookies.
Use two accounts to check that account A's local drafts are not loaded by B.
These email delivery and live authentication tests cannot pass until the project
and sender are configured; do not report them as verified beforehand.

References:
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/auth/auth-email-templates
- https://supabase.com/docs/guides/auth/auth-smtp
