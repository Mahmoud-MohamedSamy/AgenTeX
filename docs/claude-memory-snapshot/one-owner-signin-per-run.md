---
name: one-owner-signin-per-run
description: Parallel test lanes must sign each account in once per run; never print credential files
metadata:
  type: feedback
---

Each test lane signs an account in ONCE per run (one long-running JVM via CrmUser, or one saved browser session) — never a script that signs in per call. On 27 Oct 2026 a lane's probe script signed the owner in ~10 times → HTTP 429 for the owner, and old runs had left the owner at its 20-session limit ("Session Limit Reached"); clearing all owner sessions (POST /audit/login-history/clear-all as CRM Admin A) needed the user's OK because it signs out everyone on the owner account. Space owner sign-ins of different lanes apart.

Never print any line of a credential file (no head/cat on the CSVs) — a lane printed a Zoho password row (the Edge CSV has no header row); read credentials only through the existing helpers.

**Why:** the user's rule is stop on 429, no retry; lost runs and an exposed password.
**How to apply:** put both rules in every lane brief. Related: [[crm-go-live-feature-inventory]]

- TAVI staging (seen 1 Nov 2026): two browser contexts loaded from one saved session (or a browser given the API token pair) refresh the same refresh token and the server revokes EVERY session of that account, teammates included. Use one context per sign-in and save storageState back after each run.

- User rule (9 Nov 2026): run everything in ONE tenant, NDC-Staging only; ndc-staging-owner is the CRM admin. Creds index 8 (mahmoud.mahamed1515) is also NDC-Staging (tenant …0004). Two lanes may share the tenant only with separate sign-ins.
