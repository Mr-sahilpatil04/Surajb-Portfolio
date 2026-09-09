# Notes Management — Setup Guide

This feature runs on **two free backends, no credit card required for either**:
- **Firebase** (Firestore + Authentication) — notes metadata, access logs, faculty login.
- **Supabase** (Storage only) — the actual PDF/PPT/PPTX files.
- **Vercel Functions + Resend** — approval emails to students.

Why two? Firebase Storage now requires a paid Blaze plan even at zero usage
(a Feb 2026 policy change), while Firestore and Auth remain free forever on
Firebase's Spark plan. Supabase's free tier includes 1 GB of file storage
with no card needed, so it fills just that one gap.

---

## Part A — Firebase (data + login)

### 1. Create a Firebase project
1. https://console.firebase.google.com → **Add project**.
2. Click the **Web** icon (`</>`) to register a web app (skip Hosting).
3. Copy the `firebaseConfig` object shown.

### 2. Enable Firestore + Authentication
- **Build → Firestore Database** → Create database → **production mode**.
- **Build → Authentication** → Get started → **Sign-in method** → enable
  **Email/Password**.
- You do **not** need to enable Storage.

### 3. Plug in your config
Open `js/firebase-config.js` and replace the placeholder values.

### 4. Deploy Firestore rules
**Firestore Database → Rules** tab → paste the contents of `firestore.rules`
→ **Publish**.

### 5. Create your faculty/admin account
1. **Authentication → Users → Add user** → email + password. Copy the
   **User UID**.
2. **Firestore Database → Start collection** → collection ID `admins` →
   document ID = *that UID* → add field `name` (string) → Save.

Repeat for each faculty member who needs access. Anyone who signs in without
a matching `admins/{uid}` doc is blocked from `notes-admin.html`.

---

## Part B — Supabase (file storage)

### 1. Create a Supabase project
1. https://supabase.com → sign up → **New project** (no card required).
2. Wait ~2 minutes for it to provision.

### 2. Get your API keys
**Project Settings → API** → copy the **Project URL** and the **anon
public** key (not the `service_role` key — never put that in client code).

### 3. Plug in your config
Open `js/supabase-config.js` and replace `SUPABASE_URL` and
`SUPABASE_ANON_KEY`.

### 4. Create the storage bucket
**Storage → New bucket** → name it exactly `notes` → toggle **Public
bucket: ON** → Create.

### 5. Add the storage policy
**SQL Editor → New query** → paste the contents of
`supabase-storage-policy.sql` → **Run**.

---

## Security note on the split setup

Firestore's rules (Part A) genuinely enforce faculty-only access to note
metadata and access logs — that check happens server-side and can't be
bypassed from the browser.

The Supabase bucket policy (Part B), by contrast, allows any signed request
with the public anon key to upload/delete files — because Supabase has no
way to verify a Firebase-issued login token without extra server-side code.
In practice this means: the admin UI still gates uploads behind faculty
login as designed, but a technically determined visitor who extracts your
anon key from the browser could upload directly to the bucket, bypassing
the UI. For a personal faculty portfolio this is a low-stakes risk, but if
you want it fully closed, the fix is a small **Supabase Edge Function**
(free, no card) that verifies the Firebase ID token server-side before
writing — happy to build that if you'd like the extra hardening later.

---

## Upload your first note
1. Visit `notes-admin.html` on your deployed site and sign in.
2. **Upload Note** → Subject: Data Structure, Class: SY B.Tech, Unit 1 or 2,
   choose a PDF/PPT/PPTX.
3. It appears immediately on the public `notes.html` page.

## Part C — Access requests and approval emails

Students now submit their name, email, class, and division as an access request.
The note is not opened immediately. Faculty review pending requests in
`notes-admin.html`; approving a request sends the student an email containing
the note details and link, and records the approved access.

### 1. Create a Resend sender
1. Create an account at https://resend.com.
2. Add and verify the domain you will send from, or use a Resend test sender
   while developing.
3. Create an API key with permission to send email.

### 2. Add Vercel environment variables

In the Vercel project settings, add these variables for the Production
environment:

- `FIREBASE_SERVICE_ACCOUNT_JSON`: the complete Firebase service-account JSON
  from **Project settings → Service accounts → Generate new private key**.
- `RESEND_API_KEY`: the Resend API key.
- `EMAIL_FROM`: a verified sender such as `Notes Portal <notes@example.com>`.

Never put the service-account JSON or Resend key in browser JavaScript or commit
them to the repository. Redeploy after adding or changing these variables.

If approval returns the request to Pending, open the browser developer console
or Vercel function logs. Common causes are an unverified `EMAIL_FROM`, an
incorrect service-account JSON value, or missing environment variables in the
Production environment.

### 3. Publish the updated rules

Paste `firestore.rules` into the Firebase Firestore Rules tab and publish it.
Without the updated rules, students cannot submit requests and admins cannot
review them.

## Other notes
- `notes-admin.html` isn't linked from the site nav — reachable only by URL
  plus a valid faculty login.
- File size cap is 30 MB (`MAX_FILE_SIZE_BYTES` in `js/notes-common.js`);
  Supabase's free tier tops out at 1 GB total storage.
- Supabase free projects pause after 7 days with zero API activity — the
  bucket and files aren't deleted, you just need to click "restore" in the
  Supabase dashboard if that happens (only affects uploading/serving new
  files, not your Firestore data).
