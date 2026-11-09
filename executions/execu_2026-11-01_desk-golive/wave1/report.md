# Desk go-live — Wave 1 (organisation & access) report

Run 1–2 Nov 2026 on staging-desk.taviportal.com (org Anyware), owner account. Cases: `cases.md`; per-case results: `results.md`; raw API output: `raw/`; screenshots of failures: `../evidence/raw/wave1/`.

## Totals
62 cases: **47 PASS · 5 FAIL · 5 INCONCLUSIVE · 5 NOT RUN.** The 5 fails are 2 bugs and 3 gaps against Zoho.

## Bug candidates (not in Plane)
- **W1-B1 (Low): company profile has no field checks.**
  - The website "not a url" is saved without complaint.
  - A 40-digit phone number is accepted.
  - A 300-digit phone number returns a server error (500, "An unexpected error occurred"); this happened twice.
  - Evidence: `raw/w1-a.json`, `raw/w1-l.json`, `W1-04-company-page.png`.
  - Zoho: not checked (it would need a save in Zoho).
- **W1-B2 (Medium): department save loses another admin's change.**
  - Steps: two tabs edit the same department. Tab A turns CC off and saves. Tab B then saves only a description change.
  - Result: tab B's save silently turns CC back on. There is no warning, and no version check stops it.
  - Reproduced twice on QA departments. The same class of problem as NDC-2238 and NDC-2241, here on Departments.
  - Evidence: `raw/w1-c2.json`, `raw/w1-k.json`.
  - Zoho: not checked.

## Gaps against Zoho
- **Overnight business-hours block:** a block that runs past midnight is refused, while two blocks in one day work. Zoho allows overnight blocks. Check NDC-2266 before filing.
- **Personal time zone and date format:** still missing; already filed as NDC-1970.
- **Agent sign-in security:** SSO, 2FA, allowed IPs and password policy are still missing; already filed as NDC-1977.

## Known tickets
- **Now passes:** NDC-2305. A child profile inherits all 52 of its parent's permissions, plus a permission added to the parent later. The ticket was not moved and has no comment.
- **Skipped because still In Progress:** NDC-2303, NDC-2387, NDC-2736, NDC-2733.
- **Seen in passing:** the invite error is returned as the raw key `iam.subscription.seat_limit_reached`. This matches CRM's NDC-2658; the screen text was not checked.

## Inconclusive / not run
- **Agent invite and agent-view cases (W1-29, 30, 32, 33):** inviting mmohamed@anyware.software was refused with "seat limit reached", and no user was created.
- **Delete the default business hours (W1-12):** Delete is disabled on screen, so this passes on the UI. The API refusal was not run because the session's safety rules blocked it.
- **Delete the real "Agent" role:** not run, blocked by the safety rules.
- **Department "Display in Help Center" (W1-22):** the API ignored the change, and automation could not click the switch.
- **Department list "Default" badge (W1-20):** not checked on screen.
- **Rename a built-in profile (W1-41):** not tried; built-in profiles are off limits.
- **Ticket statuses:** not run, because they are tenant-wide on a shared tenant.
- **Signature create, edit and delete:** not run.

## Notes
- **Incident:** the company profile PUT replaces the whole record. The first test left out one field, which blanked the company access URL. It was restored straight away, and the final diff is clean.
- **Audit log:** every write in this wave is listed.
- **Arabic / RTL:** the screens are laid out right to left.
- **Keyboard:** the tab order is logical and every focus ring is visible.
- **Unauthenticated calls:** answered with 401.
- **Sign-out:** the owner was signed out once by staging, and was signed in again once.

## Cleanup
- **Created, then deleted:** all QA GL objects — a business-hours profile, a holiday list, 2 departments, a team, a role and 2 profiles. The two departments are in the Recycle Bin.
- **Restored:** the company website, phone, access URL and logo link.
- **Final check:** `after/diff.txt` matches the baseline; the only difference is the order of the profiles list.
- **Invite:** none was created.
