# Wave 1 — results (1–2 Nov 2026, staging-desk, org Anyware, owner)

Raw results: `wave1/raw/*.json` · scripts `scripts/w1-*.js` · evidence `evidence/raw/wave1/`.

| Id | Verdict | Note |
|---|---|---|
| W1-01 | PASS | Company page loads; no raw keys. |
| W1-02 | PASS | 200, name Anyware, time zone UTC (already UTC in baseline). |
| W1-03 | PASS | Website set and restored; name/time zone kept. Note: PUT replaces the whole object — a body without `access_url` clears it (our first try did; restored at once, final diff clean). |
| W1-04 | FAIL | Website "not a url" saved (200, no validation). Phone of 300 chars → **500 INTERNAL_ERROR** (twice). 40-digit phone accepted. All restored. → W1-B1 |
| W1-05 | FAIL (gap) | No personal time zone / date format: My Profile › Account Information has name, alias, date of birth, contact, address only. Still missing — NDC-1970. |
| W1-06 | PASS | Rebranding page loads. |
| W1-07 | PASS | logo_linkback_url set and restored. |
| W1-08 | PASS | List shows Default 24×7, time zone, holiday column; row menu Edit / Delete. |
| W1-09 | PASS | QA GL BH Mon–Fri 09:00–17:00 created (201), listed "Custom hours · Mon…Fri". |
| W1-10 | FAIL (gap) | Two blocks per day work (Mon 09–13 + 14–18 saved). A block past midnight is refused: "slots cannot cross midnight". Zoho supports overnight blocks (help: "Multi-blocks in Business Hours"). Gap, not a bug. |
| W1-11 | PASS | End before start, empty name, bad time zone → 400 with clear messages. |
| W1-12 | PASS | Default row menu: "Delete" disabled (UI). API delete of the default not attempted (blocked by the session's safety check). |
| W1-13 | PASS | QA GL BH deleted (204). |
| W1-14 | PASS | Holidays page, Active/Inactive tabs load. |
| W1-15 | PASS | List create, holiday add / edit (range 25–26 Dec) / remove all 2xx and read back. |
| W1-16 | PASS | Holiday list associated with QA GL BH. |
| W1-17 | PASS | Deactivate → inactive, activate → active, holidays kept. |
| W1-18 | PASS | No date → 400; name > 150 → 400. Note: a second holiday on the same date is accepted (201) — Zoho behaviour not checked. |
| W1-19 | PASS | Holiday list deleted (204). |
| W1-20 | INCONCLUSIVE | List loads with QA dept; text scan did not find the "Default" badge text and 4/5 column headers (case); not re-checked on screen. |
| W1-21 | PASS | QA GL Dept created (201), active. Note: `agent_user_ids` in the create body is ignored (agents are set with PUT …/agents, as the UI does). |
| W1-22 | PASS (part inconclusive) | CC, Send as Email, mass comments, help-center name saved via full-body PATCH. `visibility: public` sent by API was not applied; the UI toggle could not be driven by automation (Save stayed disabled) — visibility change not verified. PATCH needs the full body (a partial body → 400 "name is required"). |
| W1-23 | PASS | Duplicate name → 409; empty → 400; >100 chars → 400; rename to existing → 409. |
| W1-24 | PASS | Default department disable → 422 "Make another department the default first." |
| W1-25 | PASS | Disable (with transfer target) / enable work. |
| W1-26 | PASS | QA departments deleted (soft delete, 200). |
| W1-27 | FAIL | Lost update: two tabs edit the same department; the stale save silently puts back the other tab's change (CC on again). No version / If-Match. Reproduced twice. → W1-B2 |
| W1-28 | PASS | Agents page: 4 active agents, Invite user dialog (up to 10, profile picker). |
| W1-29 | INCONCLUSIVE (blocked) | Invite of mmohamed@anyware.software refused: 409 SUBSCRIPTION_SEAT_LIMIT_REACHED, message is the raw key `iam.subscription.seat_limit_reached`. No user created. |
| W1-30 | INCONCLUSIVE | Same seat-limit refusal; no duplicate created. |
| W1-31 | PASS | Bad email → 400 "Email must be valid."; unknown profile → 400 "Unknown profile."; nothing created. |
| W1-32 | NOT RUN | No invitation exists (seat limit). |
| W1-33 | INCONCLUSIVE | Agent view needs the invited agent — blocked by seat limit. |
| W1-34 | PASS | Roles page (tree collapsed by default). |
| W1-35 | PASS | QA GL Role created, renamed (needs `?app_key=desk`), deleted. |
| W1-36 | NOT RUN | Deleting the real "Agent" role to see the refusal was blocked by the session's safety check. |
| W1-37 | PASS | Profiles hierarchy page (collapsed under Desk Administrator). |
| W1-38 | PASS | Clone from Desk Agent: 52 = 52 permissions. |
| W1-39 | PASS | Child profile's effective permissions = parent (52) and it inherits a later grant. NDC-2305 looks fixed. |
| W1-40 | PASS | Grant desk:macros:manage (effect GRANT) → effective; remove → gone. |
| W1-41 | INCONCLUSIVE | PATCH of built-in "Desk Agent" with its own name returns 204; a real rename was not attempted (rule: never change built-in profiles). |
| W1-42 | PASS | QA profiles deleted (204). |
| W1-43 | PASS | Teams page lists teams. |
| W1-44 | PASS | Team create/update (name, colour, icon). Create with an agent who is not in the department → 422 with a clear message. |
| W1-45 | PASS | Duplicate name in dept → 409; empty → 400; non-member → 422. |
| W1-46 | PASS | Workload {open_tickets:0, open_activities:0}. |
| W1-47 | PASS | Team Queue lists "test" and "QA GL Team 2" with priority lanes. |
| W1-48 | PASS | Data Sharing page loads. |
| W1-49 | PASS | Ticket Access: sharing levels, public scope, peers; Ticket statuses and Agent availability tabs. |
| W1-50 | PASS | GET settings 200; PUT same body → unchanged. |
| W1-51 | NOT RUN | Tenant-wide ticket statuses — not written on a shared tenant. |
| W1-52 | NOT RUN | NDC-2303 is In Progress (skip until Ready For Test). |
| W1-53 | NOT RUN | NDC-2387 is In Progress. |
| W1-54 | FAIL (gap) | No SSO/SAML, two-factor, IP allow list or password policy page in Desk settings. Still missing — NDC-1977. |
| W1-55 | PASS | Audit log page, filters, export button. |
| W1-56 | PASS | Every Wave 1 write is in the audit log (department, team, role, profile, business hours, holiday list, company — created/updated). |
| W1-57 | PASS | My Profile = avatar menu › My Profile (/profile: Overview, Account information, Signatures). Note: the hub link /settings/my-profile is a SalesIQ entry and redirects to /hq. |
| W1-58 | PASS (read only) | My signatures page and GET /mail/signatures/me load; create/edit/delete not run. |
| W1-59 | PASS | Arabic: Departments, Business Hours, Ticket Access fully Arabic and RTL; only data names in English. |
| W1-60 | PASS | Keyboard Tab order is logical and every stop shows a focus ring. |
| W1-61 | PASS | No token → 401. |
| W1-62 | PASS | Every Wave 1 settings link opens its page. |

## NDC-Staging rerun (2 Nov 2026)

The user moved all remaining Wave 1 work to NDC-Staging; Anyware-Staging is paused. Full table: `ndc/results.md` (cases `ndc/cases.md`).

- W1-12 PASS · W1-20 PASS · W1-22 PASS · W1-29 PASS · W1-30 PASS (note: an active CRM-only user can get a second, pending Desk invitation row) · W1-32 PASS · W1-33 PASS · W1-36 PASS · W1-41 PASS · W1-51 PASS · W1-58 PASS.
- W1-52 NDC-2303 PASS (fixed) · W1-53 NDC-2387 PASS (fixed).
- W1-B1 reproduced on screen on NDC (300-digit phone → "An unexpected error occurred"); the website is checked on screen, not by the API. Zoho: phone max 20 characters, website max 50, no URL check.
- W1-B2 reproduced on screen on NDC (two tabs, CC back on). Zoho: not checked (department edit does not save in the trial org).
- Annotated images: `evidence/annotated/W1-B1-vs-zoho.png`, `evidence/annotated/W1-B2-vs-zoho.png`.

## Close-out (2 Nov 2026) — filed and moved

- Bugs filed (state Bug, MahmoudMohamed + mfathy + Hegazy + eahmed, Desk module, Sprint 14, annotated image attached):
  - **NDC-2776** W1-B1 Low — Company profile: long phone → "An unexpected error occurred", no length limit.
  - **NDC-2777** W1-B2 Medium — Departments: stale save undoes another admin's change.
  - **NDC-2778** W1-B3 Medium — Agents: inviting an email of an active user creates a second, pending user (from W1-30 note).
  - **NDC-2779** W1-B4 Low — Audit Log: company save logs "time zone from blank value to UTC" though unchanged (from W1-04 audit note).
- Retests moved to Done with comment + image: **NDC-2303**, **NDC-2387**.
- Images: `evidence/annotated/W1-B1..B4-vs-zoho.png`, `NDC-2303-retest.png`, `NDC-2387-retest.png` (specs in `evidence/specs/`).
- Wave 1 is closed. Only NDC-2305 (passes, was In Progress) waits for Ready For Test.
