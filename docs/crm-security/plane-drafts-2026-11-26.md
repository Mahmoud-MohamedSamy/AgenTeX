# Plane drafts — 26 Nov 2026 (NOT FILED)

Project: NDC · Module: CRM · Environment: NDC-Staging (https://staging-crm.taviportal.com)

---

## Draft 1 — FILED 26 Nov 2026 as NDC-3343 (CRM module, Localization, Low, screenshot attached)

**Title:** Users | HR ID column header shows the text "users.table.hrId"

**Priority (suggested):** Low · **Labels:** Bug, UI, i18n

**Steps to reproduce**
1. Sign in to CRM as an admin.
2. Open Settings → General → Users.
3. Look at the column headers in the users table.

**Expected result**
The column header reads "HR ID" in English and its Arabic text in Arabic, like the other headers (Invitation Status, Profile, Org unit, Referral code).

**Actual result**
The header shows the raw text `users.table.hrId`. Same in Arabic.

**Notes**
- The export already uses the correct "HR ID" name; only the table header is wrong.

**Evidence:** screenshot of Settings → Users (26 Nov 2026).

---

## Draft 2

**Title:** Security Policies | No way to sign in when the authenticator app is lost (no backup codes, no admin 2FA reset)

**Priority (suggested):** High · **Labels:** Gap, Security

**Steps to reproduce**
1. As a user, turn on two-factor authentication and scan the code with an authenticator app.
2. Delete the entry from the authenticator app (or lose the phone).
3. As the admin, open Settings → Security Policies → Two-factor authentication, set the policy to **Optional** with **No profiles**, and save.
4. Sign out, then sign in again as the user from step 1.

**Expected result**
The user has a way back into the account, for example:
- the 2FA screen offers "Use a backup code" (backup codes are given when 2FA is first set up), and/or
- an admin can reset 2FA for that user from Settings → Users, so the user signs in with the password and sets up 2FA again.

**Actual result**
- The sign-in still asks for the 6-digit code ("Two-factor authentication required").
- The code screen only has the code box, "Trust this device for 30 days" and "Back to sign in".
- There is no backup code option, and no admin action to reset the user's 2FA. The user is locked out.
- Settings → Users still shows **2FA = On** for that user after the authenticator entry was deleted.

**Notes**
- It is expected that a user who turned 2FA on is still asked for a code in Optional mode (the policy screen says "Existing setups stay saved"). The problem is that there is no recovery path.
- If the locked-out user is the Owner, no one else may be able to recover the account.

**Evidence:** Jam https://jam.dev/c/b498ec08-377c-4aea-b6bb-5a43ee52389b (sign-in at 0:45 and 1:08, code screen 0:50–1:12); screenshot of Settings → Users (2FA column).

---

## Draft 3 (needs confirmation before filing)

**Title:** Users | HR ID 209 out of sequence for one user

**Priority (suggested):** Low · **Labels:** Bug, Data

**Steps to reproduce**
1. Open Settings → General → Users.
2. Look at the HR ID column.

**Expected result**
HR IDs follow the same numbering as the other users (1–10 for 10 users), unless an admin set the value by hand.

**Actual result**
Nine users have HR IDs 1–9; the first user in the list (CRM Admin, Sales) has HR ID **209**.

**Notes**
- Not confirmed yet: 209 may have been entered by hand or kept from earlier test data. Check the user's history or audit log before filing.

**Evidence:** screenshot of Settings → Users (26 Nov 2026).

---

## Draft 4 — FILED 26 Nov 2026 as NDC-3344 (CRM module, Login & Sessions, Medium, 2 images attached)

**Title:** Security Policies | Two-factor authentication Optional policy can be saved with no profiles selected

**Priority (suggested):** Medium · **Label:** Login & Sessions · **Module:** CRM

**Steps to reproduce**
1. Go to Settings → Security Policies.
2. In the Two-factor authentication card, select **Optional**.
3. Leave "Profiles that must set it up" as **No profiles**.
4. Click **Save**, then refresh the page (F5).

**Expected result**
The Optional hint says "The profiles below must set it up". So Save should ask for at least one profile, or the screen should clearly say that with no profiles nobody is required to set up 2FA.

**Actual result**
Save succeeds ("Saved"); after the refresh the policy is still Optional with No profiles; no warning is shown.

**Notes**
If Optional with no profiles is meant to be allowed, the devs should confirm it and the hint text should say so.

**Evidence:** Jam https://jam.dev/c/aa05f8d2-bdd8-41e6-b637-6fd8b01781c6 — img/2fa-optional-no-profiles-saved.jpg (0:17), img/2fa-optional-no-profiles-after-refresh.jpg (0:20); the save sends "optional" + an empty profile list and the server accepts it (0:11, 0:14).
