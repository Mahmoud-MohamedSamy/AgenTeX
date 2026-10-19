# Desk Workflow Rules — test run, 12–14 Oct 2026

- **App:** staging-desk.taviportal.com (owner account), Edge 154 headless, Selenium + RestAssured (`automation/`).
- **Spec:** `docs/desk-workflow-rules/spec-desk-workflow-rules.md`.
- **Reference:** Zoho Desk (read-only captures).
- **Scope:** the automated part of the spec, 78 test methods plus the new API-T3 case.
- **HTML version for the team:** `bug-report.html`.

## How the run went

The connection between this PC and staging dropped many times (DNS failures, 60 s hangs, connection resets), and the staging tags service was down once (503). Full runs kept ending in mass skips. Everything was therefore finished in **small batches of 2–5 tests**: before each batch the script waits until staging answers, and cleans up after.

| Run | Passed | Failed | Skipped | Notes |
|---|---|---|---|---|
| 12 Oct, full run 1 | 2 | 11 | 64 | Every ticket create gave 500 (bug B-1); then the login page stopped loading |
| 12 Oct, full run 2 | 19 | 20 | 39 | 39 skipped by network errors |
| 13 Oct, reruns of the 39 | 4 | 1 | 35 | Network: timeouts, DNS failure, one "Sign in failed" |
| 13 Oct, batches of 5 and 2 | 33 | 6 | 0 | All 39 ran |
| 14 Oct, the 9 cases left from 12 Oct, then fixes | 10 | 2 | 0 | Tests updated for UI changes (see below); J7 made conclusive |

Every automated case has now run. Logs and summaries are in `runs/`.

Teammates' rules were paused during execution tests and restored after each one. **Final check (14 Oct, 09:50): paused left 0. All 8 teammate rules are active, and no QA rules, saved actions or tickets are left.**

## Final verdict per automated case

### Passed (62)

| Area | Cases |
|---|---|
| Smoke | WFR-001, WFR-002 |
| Triggers and conditions | H1, H2, **H3 (NDC-2205 On Edit)**, **H4 (NDC-2205 Field Changed)**, H5, H8, H9, H11, H12, H19, D2 |
| Action results | I1, I6, I11+I17, I12, I13+I16, I15, I18 (email), I22, I24, I26, I27, I33 |
| Date-Time | **J2+J11, D7, WFR-020 (NDC-2206, API and UI)** |
| Rules list, editor and pages | B1, B3, **B6 (NDC-2173)**, B7, C2, E2, F1, F2, G3+F5, K1, M2, **WFR-031 (NDC-2204)** |
| API contract | A9, A11, B8, B9, B13, E11, E16, F4, F19, G1, G7, G8, L4, L5, M3, K3+K6+K7, K5, K9, API-T1, API-T2 |
| Gaps now built | Z08 (rules per department), Z09 (Active / Inactive tabs) |

### Failed: app bugs (7)

| Case | Bug |
|---|---|
| API-T3 | **B-1** Ticket create answers 500 when `kind` is not the first key of a field value |
| F7 | **B-2** A Field Update action on the read-only `created_by` field is accepted |
| K2 | **B-3** The Actions library cannot create "Send happiness email" |
| I14 | **B-4** A webhook that gets HTTP 404 is shown as `cancelled`, not `failed`; response status empty |
| F3 | **B-5** The action picker offers Task and Add Tags again after the rule already uses them |
| M1 | **B-6** No menu link to Execution History |
| J7 | **B-7** A scheduled action cancelled because the ticket stopped matching leaves no trace in Execution History |

### Missing compared with Zoho (fail as expected)

Z01, Z06, Z10–Z12, Z14, Z16, Z17, Z23–Z27. See the Group Z table.

### Retired from regression (2)

**WFR-012** and **WFR-013** create their ticket through the old UI ticket form, which is unstable. H3 and H4 check the same NDC-2205 behaviour through the API, and both pass. The two tests are kept under the `NDC-2205` tag only.

## Bugs found (not filed in Plane yet)

**B-1 — Record API answers 500 when `kind` is not the first key of a field value.** High.
- `POST /api/v1/modules/{tickets}/records` with `{"value":{"value":"x","kind":"string"}}` → `500 INTERNAL_ERROR`. With `"kind"` first → 201.
- Trace ids: 1a8142a0-…, 2cb19344-…, 5a4ce6fa-…, be6c6962-….
- JSON key order must not matter, and many client libraries don't keep it.

**B-2 — Field Update on the read-only `created_by` field is accepted.** Medium.
- `POST /workflow/rules` with a Field Update on `created_by` saves the rule.
- The same request for `ticket_number`, `created_time` and `approval_status` is refused.
- Same family as CRM bug NDC-1437.
- Not checked: whether running the rule changes the creator.

**B-3 — The Actions library cannot create "Send happiness email".** Medium.
- The rule editor offers it inline, but the library's types stop at Remove Tags.
- Evidence: `screenshots/annotated/WFR-K2-tavi-only.png`.

**B-4 — A webhook rejected with 404 is marked `cancelled`.** Low.
- Correct: one attempt, no retry, `lastError: "http 404"`.
- Wrong: the status is `cancelled` instead of `failed`, and `responseStatus` is null.

**B-5 — The action picker offers types the rule already uses.** Low.
- A rule with Field Update, Add Tags and Task: the picker hides Field Update but still offers Task and Add Tags. A rule allows one action per type.
- Evidence: `screenshots/annotated/WFR-F3-tavi-only.png`.

**B-6 — No menu link to Execution History.** Low.
- With the Setup menu fully loaded, the AUTOMATION section lists Workflow Rules, Actions, SLA & Escalation, Support Plans, Assignment Rules, Macros, AI Tagging, Ticket Archiving and Time Tracking.
- There is no Execution History entry, and the rules list and editor don't link to it either.
- The page exists at `/settings/workflow-executions` (route found in the app's code).

**B-7 — A cancelled scheduled action leaves no trace in Execution History.** Low.
- The test used one rule with a webhook scheduled 3 minutes after create, and two tickets that both match.
- The control ticket kept matching: its webhook arrived after 3 minutes, and its dispatch shows `succeeded`.
- The other ticket stopped matching before the delay: no webhook arrived, so the cancelling works. But its execution has **no dispatch at all**, neither "scheduled" while waiting nor "cancelled" afterwards.
- The editor itself says scheduled actions "are cancelled if the record stops matching", but an admin can't see that this happened or what was pending.

**B-8 — Workflow Create Record skips required fields and leaves the record without an owner.** Medium. (WFR-I25, 14 Oct)
- On Calls, Name, Subject and Call Start Time are required.
- A rule whose Create Record action maps only Call Start Time is **accepted on save**.
- At run time it **creates the Call** with no Name and no Subject (`compliance_state: valid`, `owner_user_id: 00000000-…`), and the dispatch shows `succeeded`.
- The editor enforces "required fields can't be empty"; the API save and the engine don't.
- The stray Call was deleted.

**B-9 — Owner Assignment by role (round robin) does not assign anyone.** Medium. (WFR-I8, 14 Oct)
- The Desk role CEO has 7 active users, and 4 of them are agents in the ticket's department. The test account isn't in the role.
- An On Create rule "Owner = role CEO, round robin" shows `Fired` on 3 tickets, but each ticket keeps its default owner (the creator).
- There's no dispatch and no error.

**Cleared (not bugs):**
- **I26 Add Tags:** "Add to existing tags" kept tag B and added A; "Replace existing tags" left only C. Our first test was wrong: tags go through `POST /desk/tickets/{id}/tags`, not the ticket-create body.
- **H19:** one Execution History row per run.
- **M2:** the Execution History page loads; it renders a few seconds after the page opens.
- **D2:** the Field Changed trigger now pre-selects a watch field, so a rule can't be saved without one.
- **"Ticket without department → 500"** and **"500 in Customer Support"** were both bug B-1.

**Possible bug noted earlier and not checked:** Ticket History shows the raw department id.

## Groups H, I, J — remaining cases (14 Oct, in progress)

The 36 H/I/J cases that had no test yet. Tests: `WorkflowHijTest`.

| Status | Cases |
|---|---|
| **Passed (25)** | H6, H7, H10, H13, H14 (shown by every test: tickets created through the API fire rules), H15, H16, I10, H17, H18, H20, I2, I3, I4, I5, I7, I23, I31, I32, J1, J3, J4, J8, J9, J10 |
| **Failed: bugs (2)** | I25 (B-8), I8 (B-9) |
| **Skipped as agreed: email and Customer Happiness (6)** | I19, I20, I21, I28, I29, I30 |
| **Not run (3)** | I9 (suspend an agent), J5, J6 (change company business hours): you approved them, but the automated run was not allowed to make these changes. Waiting for a manual run or for that permission. |

**What the records show:**

- **H10:** rules run in list order, and a later rule sees an earlier rule's Field Update. With the order reversed, the dependent rule no longer matches.
- **H15:** a bulk edit of 3 tickets runs an Edit rule once per ticket.
- **H17:** a workflow's own update doesn't trigger a Field Changed rule (as NDC-2205 expects).
- **H18:** an Edit rule that edits the ticket runs once and doesn't loop.
- **I5:** a Field Update on create is already in the create response.
- **I32:** an inactive saved action is skipped, but Execution History doesn't say so (only "Fired"). This is the same blind spot as B-7.
- **J1:** "5 min before Due Date" fired on time.
- **J3:** a date already past the offset never fires.
- **J4:** moving the date reschedules the action, and the old time doesn't fire.
- **H13:** a rule scoped to a layout runs only for tickets on that layout.
- **I3:** a date-only Field Update stores just the date (`2026-10-20`), so NDC-1438 does not appear in Desk.
- **I4:** changing only the City keeps Street and Country (key `<field>.city`), so NDC-1436 does not appear in Desk.
- **H16:** a macro that changes a ticket counts as an edit, so Edit rules run once.
- **I10:** when an assignment rule and an Owner Assignment workflow both apply, the workflow sets the final owner (as in Zoho).
- **J8, J9, J10:** deleting or deactivating the rule, or deleting the ticket, cancels queued actions; the control actions still ran.

**QA layout (H13, I3, I4), as you asked:**
- I created a separate layout, "QA WF Layout", with no profile assignments and not the default. The two QA fields (date-only, address) were added to that layout only.
- The Standard layout was saved first (`runs/standard-layout-baseline-14oct.json`) and checked after every step: it never changed.
- After the tests, the QA layout and both fields were deleted (204), and Standard still matches the baseline.

## Earlier tickets

| Bug | Today |
|---|---|
| NDC-2203 (gaps) | Still open. Z8 (rules per department) and Z9 (Active / Inactive tabs) are now built. |
| NDC-2204 (CRM profiles in Roles) | **Looks fixed.** Owner Assignment now has separate tabs: **Roles** lists CEO and Manager; the new **Profiles** tab lists the 5 Desk profiles (Desk Administrator, Supervisor, Agent, Light Agent, Reviewer). On 12 Oct the Roles tab showed those profiles. |
| NDC-2205 (On Edit / Field Changed fire on create) | **Looks fixed** (H3, H4). |
| NDC-2206 (Date-Time rule 500) | **Looks fixed** in API and UI (J2, D7, WFR-020). Date rules take only async actions, and the editor hides the others. |
| NDC-2173 (long names) | **Looks fixed** (B6). |

## Group Z — still missing or built

| Item | Today | Evidence |
|---|---|---|
| Z1–Z5 Customer Reply, Agent Response, Private Thread, Happiness Rating, Comment triggers | Still missing | `WFR-Z01-vs-zoho.png` |
| Z6 Field Update on several fields | Still missing (Watch field is single-select) | `WFR-Z06-vs-zoho.png` |
| Z7 Several events in one rule | Still missing | `WFR-Z01-vs-zoho.png` |
| Z8 Rules per department | **Built:** Departments column and filter on the list, and "Departments … Change" in the editor | — |
| Z9 Active / Inactive tabs | **Built** | — |
| Z10 Contact / account conditions | Still missing | `WFR-Z10_WFR-Z11_WFR-Z12-vs-zoho.png` |
| Z11 Business hours / holiday condition | Still missing | same |
| Z12 Missing ticket fields in conditions | Partly: Closed Time, Ticket Number, Spam and Skills are now offered | same |
| Z14, Z15 Add Comment, Send Email Reply | Still missing | `WFR-Z14-vs-zoho.png` |
| Z16 Email to contact / outside addresses | Still missing: "Free-text addresses aren't allowed." | `WFR-Z16-vs-zoho.png` |
| Z17 Assign to a team | Still missing. Owner Assignment has Users / Roles / Profiles / User Fields | `WFR-Z17-vs-zoho.png` |
| Z23–Z27 Custom Functions, chat, IM, skills, AI actions | Still missing | `WFR-Z23_…_Z27-vs-zoho.png` |
| Z13, Z18–Z22, Z28 | Not automated; the action list is unchanged (the same 9 actions) | missing-list evidence 03–06 |

## Email service

There was no problem. The workflow Email action to an agent finished as `succeeded`, response 200, on the first attempt. Inbox delivery was not checked.

## Webhooks (webhook.site)

- POST and PUT arrive with merge fields filled in (I11, I12).
- A 500 is retried (I13/I16).
- A slow receiver is not reported as succeeded (I15).
- A failing webhook doesn't stop other actions (I33).
- A scheduled webhook runs after its delay (J7 control).
- A 404 is labelled `cancelled` (B-4).

## UI changes seen on staging between 12 and 14 Oct

- Rules list: Departments column and an "All departments" filter.
- Rule editor: "Departments … Change" in the header.
- After saving, the editor returns to the rules list.
- Owner Assignment: a new **Profiles** tab next to Roles.
- Field Changed: a watch field is pre-selected.
- Date-Time trigger: a required "Date field" picker; actions that can't run from a date are hidden.

## Test-side changes (12–14 Oct)

- `kind` objects are built with ordered keys (`Rules.kinded`).
- `ApiClient`: 30 s connect and 90 s read timeouts; tokens and cookies are masked in Allure.
- Updated for the app changes: I18, J2, D7, WFR-020 (Date field, async action, save goes back to the list), WFR-031 (Roles = CEO / Manager), D2, M2 (waits for render), the Save locator.
- I26 and I27 rebuilt: starting tags go through the ticket tag endpoint. J7 has a control ticket.
- `restorePausedRules` also purges QA rules, actions and tickets, plus older "QA 2205" and "QA 2206" rules.
- `target/run-batches.sh` runs tests in small batches. Before each batch it waits for staging, restores paused rules, and stops if sign-in fails.

## Revert proof (14 Oct 2026, ~09:50)

- **Workflow rules:** only the 8 teammate rules, all `isActive=true`.
- **QA data:** no QA rules, saved actions or tickets.
- **Tags:** the QA tags A/B/C in Tech stay on purpose; the tests reuse them.
- **Paused-rules file:** empty.
