# Login — feature map

App: TAVI Desk staging — https://staging-desk.taviportal.com (verified 12 Oct 2026)
Account: `ndc-staging-owner` from `docs/Credentials/TAVI Staging Desk Credentials.csv` (gitignored; columns name,username,password,note — picked by the email's part before @)

## Where it lives
| What | Value |
|---|---|
| Login page | `/login` — heading "Sign in Desk", Email, Password (eye toggle), "Forgot password?", "Sign in", "Register" |
| After login | lands on `/` (Tickets shell) |
| Saved session | `automation/.auth/staging-desk.taviportal.com_ndc-staging-owner.json` (gitignored) |

## Pages
- `qa.features.login.LoginPage` — `open()`, `formShown(s)`, `headingText()`, `forgotPasswordOffered()`, `passwordTypeAfterToggle()`, `login(email, password)` (used by `AuthManager`; one-step and two-step forms).

## How auth really works (Desk)
- Login returns an **access token valid 5 minutes** and a **refresh token valid 30 days**, both stored as JS-readable cookies on `.taviportal.com`: `aw_staging_access_token`, `aw_staging_refresh_token` (other environments: `aw_<env>_…`). localStorage holds `aw_auth_tenant_id`.
- The app refreshes with `POST /api/v1/iam/auth/refresh` (body `{refresh_token}`, header `X-Tenant-Id`) and **rotates** the refresh token each time.
- API: `Authorization: Bearer <access token>` + `x-app-key: desk`. `api.tokenScript` reads the cookie (config.properties).

## Traps
- **Shared account → "Refresh rejected — session revoked".** A new login elsewhere (a teammate, another tool) revokes this session. Symptom: tests land on the login page mid-run. Don't loop logins: `AuthManager` allows one login per run and fails the rest fast.
- **Stale refresh token.** Because the refresh token rotates, the session is re-saved after every signed-in test (`AuthManager.persist`, called by `BaseTest`). Restoring an old copy can get the session revoked.
- **Staging serves some JS assets very slowly** (one took 19 s, others timed out once, minutes later all < 1 s). Driver uses `pageLoad.strategy=eager`; element waits do the rest. The first page of a run can take 60–80 s.
- After the eye toggle the password input becomes `type=text`; the healer promoted `input[autocomplete='current-password']` (12 Oct 2026) — correct, keep it.
- No wrong-password test on purpose: failed logins count toward the 429 rate limit of a shared account.

## Test inventory
| Case | Test | Groups | Last result |
|---|---|---|---|
| LGN-001 | LoginTest.loginPageShowsSignInForm (@NoAuth) | smoke, regression, login | PASSED 12 Oct 2026 |
| LGN-002 | LoginTest.showPasswordRevealsField (@NoAuth) | regression, login | PASSED 12 Oct 2026 (healed password locator) |
| LGN-003 | LoginTest.signedInSessionLandsInApp | smoke, regression, login | PASSED 12 Oct 2026 |
| LGN-004 | LoginTest.sessionIsReusedWithoutNewLogin | regression, login | PASSED 12 Oct 2026 |

Run: `./mvnw test -Dtags=login`

## Run history
| Date | Scope | Passed | Failed | Healed | Notes |
|---|---|---|---|---|---|
| 2026-10-12 | LGN-001..004 on staging | 4 | 0 | 1 | First live run. 2 real logins in total today: the first session was revoked (see Traps); fixed persist/restore, second login held for the rest of the day's runs. |
