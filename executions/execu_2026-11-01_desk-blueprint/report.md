# Desk Blueprint — functional run, Phase 1 (owner only)

| | |
|---|---|
| App | TAVI Desk staging `https://staging-desk.taviportal.com`, org **Anyware**, owner `anyware-staging-owner@…` (bundle `index-CA-OX4H6.js`, redeployed during the day) |
| Spec | `docs/desk-blueprint/spec-desk-blueprint.md` |
| Automation | `automation/…/deskblueprint/` — `BlueprintRunTest`, `BlueprintAdminTest`, `BlueprintTimerTest`, `BlueprintUiBugTest` (feature map: `automation/src/test/resources/features/deskblueprint/feature-map.md`) |
| Date | 1 November 2026 |
| Department | QA WF Dept R; every record named `QA BP …`; nothing touched outside it |
| Cleanup | All QA blueprints and tickets deleted after each test/class; final check found none left. Demo blueprints not touched. No ticket statuses added (Add State not used). |

## Result

30 automated tests, 81 spec rows covered: **26 passed, 4 failed** (1 new finding + 3 filed bugs still open).

The first combined run (`bp-full-run.log`) had 3 failures and 7 skips caused by staging network errors (read timeouts, connection reset, browser sign-in timeout). Those 10 tests were run again (`bp-rerun.log`): 6 passed, 3 failed only on the known bugs, 1 failed only on the new finding. Every test listed as passed below passed in a clean run.

| Area | Spec rows | Result |
|---|---|---|
| Entry on create, criteria, other department, inactive blueprint, order (first match wins, re-order), include at a state | I1, I2, I5, I6, I7, I8, B7 | Pass |
| Running transitions: no-item run, required checklist / comment / field, resolution, common transition, wrong or stale transition, same run sent twice, run_id required | J2, J3, J7, J8, J9b, J13, E3, E5, E6, E8, C17, H5 | Pass |
| Status locked while in a blueprint (API PATCH refused: "Governed picklist field can only change via blueprint transition execution"), revoke one / bulk / all, status kept after revoke | J4, L4, I10, I11, I12 | Pass |
| After-action field update, blueprint completes at the final state, ticket history entries | F1, I13, M1 | Pass |
| State time limit (SLA tie-in), calendar clock: due and warning times exact, warning actions and time-limit actions run once, automatic move after 3 min, nothing fires after the ticket leaves the state or is revoked | K1, K2, K6, K7, K10, K11, G2, G5, G8 | Pass |
| Draft not live until publish (checked with tickets), publish, restore an older version | H1, H2, H4 | Pass |
| Delete refused while tickets inside (409 BLUEPRINT_IN_PROGRESS), removing an occupied state refused, partial PUT does not wipe | B8, B9, C19, H7 | Pass |
| Server checks: empty name, duplicate state, unknown target state, 17 connections on one state | C2, C13, C15, C16 | Pass |
| No token → 401; tenant header with another id does not return other data (token's tenant wins) | A3, A9, A10 | Pass |
| **Entry criteria in an unknown shape** | N2, C6 | **Fail — new finding (below)** |
| **NDC-2755** state panel and automatic close | G11 | **Fail — bug still open (narrowed)** |
| **NDC-2756** time-limit example | G7 | **Fail — bug still open** |
| **NDC-2757** Close ticket in a blueprint | J6 | **Fail — bug still open (narrowed)** |

## Findings

### New — entry criteria in an unknown shape is saved and catches every ticket (BP-N2, filed as NDC-2758)
- Steps: POST `/modules/{tickets}/blueprints` with `entryCriteria: {"kind":"StringMatch","field":"subject","operator":"StartsWith","stringValue":"QA BP N2-ONLY "}` (the workflow-rule format, not the designer's `{op, field, value}`), activate it, create a ticket "QA BP N2 other subject" in the department.
- Expected: the server refuses criteria it cannot read (400/422), or applies them; the ticket does not match, so it does not enter.
- Actual: 201 Created, and the non-matching ticket entered the blueprint — the blueprint behaves as "all tickets".
- Risk: an integration or a hand-written API call with a slightly wrong criteria body silently turns a narrow blueprint into one that catches every ticket in the department. API only (the designer always sends the right shape). Filed 1 Nov as NDC-2758 (Medium, Bug, Desk, Sprint 14). NDC-2755 and NDC-2757 got re-check comments; NDC-2755 title changed to "can't be seen or changed there".

### NDC-2755 — re-check
- Still open: on a QA copy (state with `autoTransitionId`, `autoTransitionAfterMinutes: 4320`, no time limit), the state panel shows Time limit empty ("No limit") and no "When it runs out" setting.
- Narrowed: after "Save state" and "Save and Publish" the automatic close is **kept** (published, `autoTransitionId: autoclose`, 4320 minutes). So it is hidden and cannot be edited, but not lost. Evidence: `evidence/BP-G11_NDC-2755.png`.

### NDC-2756 — re-check
- Still open: tenant business hours are 24×7, the example says "A ticket that enters on Monday 16:00 gets the warning on Tuesday 15:00 and is due on Tuesday 16:00. Counted on a Monday to Friday, 9 to 5 week." Evidence: `evidence/BP-G7_NDC-2756.png`.

### NDC-2757 — re-check
- Still open: "Close ticket" is shown and active on a QA ticket inside a QA blueprint. It opens "Close this ticket? The requester can still reply, which reopens it."; after confirming, the server refuses and the page says "The blueprint "QA BP NDC-2757 copy" controls this ticket's status. Use one of its transitions." Status stays Open, the ticket stays in the blueprint.
- Narrowed: no data harm; the agent is offered an action and only told at the last step that it is not allowed. Evidence: `evidence/BP-J6_NDC-2757.png`.

## Not run in Phase 1 (Inconclusive until set up)
- Agents (non-owner rows A2/A4–A8, D1–D8 owners and cross-department share, J9 cross-department run, E12 access withheld): no agent accounts given.
- Business-hours clock and holidays (G6, K8, K9): the only business-hours set is 24×7.
- Customer reply / rating triggers (K3–K5): need a real customer mailbox and Customer Happiness.
- Webhook (F5, K12) and custom action (F7, K13): no receiver / no safe custom action.
- Email after-action (F6), notification (F3), task (F4): not automated yet.
- Add State rows (C9–C11): not run on purpose (would add permanent ticket statuses).
- Designer UI rows other than the bug re-checks (C1, C3–C12, C18, C20–C23, D, E, G1/G3/G4/G9/G10 on screen), i18n/RTL, a11y, performance, browsers (N5–N11), IM (N10), L1–L3/L5–L8 automation interplay, K14–K17 department SLA pause in On Hold: not covered in this phase.
- NDC-2753 (attachment in a transition, 422): not re-checked (needs a file upload step).

## Notes
- Teammates are working in org Anyware during the day: "Demo · Refund approval" became inactive, "Test Blueprint" active with 4 tickets, and a new "Test Tickets From Mail & Webform" blueprint catches every techSupport ticket. The QA tests stayed in QA WF Dept R.
- The ticket API field for the department is `department` (not `department_id`); without it a ticket lands in the default department techSupport.
- Scripts used for discovery (API probes, leftover check) are in `scripts/`; passwords come from the environment, none are stored.

---

# Phase 2 — owner only, no agent accounts (1–2 Nov 2026)

Same tenant, owner and department. Every record was `QA BP …` (blueprints, tickets, 3 workflow rules, 1 SLA policy for QA WF Dept R, 1 task), deleted after each test; a final check found no QA BP blueprints, tickets, rules or SLA policies. Nothing was saved in a designer; Add State was not used; business hours were not touched.

- API: `BlueprintPhase2ApiTest` (20 tests): **15 passed, 4 failed (new findings), 1 inconclusive**. Log `bp-p2-api-run.log` (+ `bp-p2-api-rerun.log`: afterActions after a test fix).
- UI: Playwright scripts `scripts/ui-p2.js`, `ui-p3.js`, `ui-chrome.js` on QA copies (Edge, plus Chrome 131). Discovery probe `scripts/probe-p2.js`. NDC-2758 evidence: `scripts/repro-2758.js`, `evidence/annotated/NDC-2758-vs-zoho.png` (attached in Plane).

| Area | Spec rows | Result |
|---|---|---|
| New blueprint page: empty-canvas text; Field fixed to "Ticket status" with a lock | C1, C7 | Pass |
| Unreachable state refused by the server ("State 'Escalated' is unreachable") | C14 | Pass |
| Name data classes: XSS text, Arabic/emoji, trailing spaces stored as typed; **no length limit** (309 characters saved) | C3 | Pass / record |
| Duplicate name in the same department | C4 | Record: allowed |
| State panel: "No limit", "1 of 16 connections", reopen hint, example text; warning ≥ limit shows "The warning must come before the time limit." | G1, G2, G3 (UI), G10, C16 | Pass |
| Transition panel: "Nothing to fill in, so the agent runs it in one click."; no validation option (Z4) | E1, E14 | Pass |
| Undo / redo / tidy keep transitions; leaving with changes asks "Unsaved changes … Keep editing / Leave without saving" (plus the browser leave prompt) | C21, C23 | Pass |
| Phone width 390 px: "Draw states and connectors on a larger screen", no sideways scroll | C22 | Pass |
| Customer reply / rating triggers: valid saved; from another state or on an exit state refused | G9 | Pass |
| Auto-move: under 1 minute and transition with required items refused | G5 (part) | Pass |
| Transition criteria (`before.visibilityCriteria`): button only on matching tickets; API run on a non-matching ticket → 403 BLUEPRINT_NOT_OWNER | D9, D10 | Pass |
| Ticket form: items in the configured order (message, checklist, comment, attachment, field), message read-only, Run disabled until required items are filled, "Then: Update field" | E9, E10 | Pass |
| Required fields: missing and invalid values refused per field; valid values saved; non-fillable fields (is_spam, first_response_time) refused at save | E7 | Pass (note: an empty list passes a required multi-select) |
| Optional checklist / comment not needed to run | E11 | Pass |
| Script text in names, checklist, message, comment, resolution: shown as text in designer and ticket; conversation sanitises it (script removed, `onerror` stripped); no dialog fired | E13, N1 | Pass |
| After-actions run in order (last field update wins); task created in Desk tasks, linked to the ticket, `{{subject}}` replaced | F8, F4, F10 | Pass |
| Notification and email to the owner | F3, F6 | **Inconclusive**: the owner is both actor and ticket owner; needs a second agent |
| Workflow On Edit runs after transitions with and without required fields [reg NDC-2420] | F9 | Pass |
| Workflow On Create sets priority before the blueprint checks entry criteria (as Zoho) | L1 | Pass |
| Department SLA pauses (first response and resolution) while the ticket is in a blueprint state on an On Hold status, resumes after; SLA reapply keeps the blueprint state; the state's own timer keeps running in On Hold | K14, K17, K15 | Pass / record |
| Move to another department: the ticket leaves the blueprint (status kept); Zoho refuses the move | L7 | Record — differs from Zoho |
| Type confusion / unknown kinds / 400 states / unknown department → 4xx with a message, no 500 | N2 | Pass |
| Random ids → 404; unknown transition → 422 | N4 | Pass |
| Include / revoke 25 tickets: counts right, 1.2–1.3 s each | N9 | Pass |
| Both overdue (2 Nov): department SLA (first response 1 min, resolution 2 min) and state limit 1 min all passed: header "SLA Violated", Steps "Overdue by 2 minutes · Due 10:33", SLA card First response and Resolution each "Violated" with their own due times; state time-limit action ran once. Times correct, nothing mixed up | K16 | Pass |
| Arabic: designer and ticket translated, html `dir=rtl`, panels mirrored, Arabic transition names correct | N5, N6 | Pass (note: a name ending in ">" shows the bracket at the start in RTL) |
| Keyboard / labels: icon buttons all named; canvas handles "Draw a transition from this state"; zoom controls labelled; Tab starts with "Skip to content" | N7 | Pass |
| Chrome 131: designer renders, a state can be dragged | N11 | Pass |
| **NDC-2753** attachment in a transition | E4 | **Still fails**: the upload shows a green tick, Run answers 422 "File … does not belong to you." |
| Big blueprint 30 states / 80 transitions | N8 | Not runnable as written: states must be existing ticket statuses (the tenant has 5); Add State not used |

## Phase 2 findings (filed 2 Nov: NDC-2761..2764)

1. **NDC-2761 · BP-P2-1 (G3) — the API saves a warning that is not before the time limit.** `slaMinutes 120, slaPreExpiryMinutes 120` → 201; warn 120 with limit 60 → 201; a warning with no limit → 201. The designer blocks these ("The warning must come before the time limit.").
2. **NDC-2762 · BP-P2-2 (G4) — the API saves a negative time limit.** `slaMinutes: -1` → 201 (0 is also saved; 1.5 and text are refused).
3. **NDC-2763 · BP-P2-3 (G5) — the API saves an automatic move pointing at a transition that starts from another state.** State Open, `autoTransitionId` = a transition from Escalated → 201. The same mistake in customer triggers is refused (G9).
4. **NDC-2764 · BP-P2-4 (L3) — a workflow rule can change Status on a ticket that a blueprint controls.** QA workflow On Edit with Field Update Status = Closed: after a transition to Escalated the rule ran, Status became Closed and the ticket left the blueprint. A direct status change by API on the same ticket is refused (TICKET_IN_BLUEPRINT). Same family as NDC-2730 (CRM).

Items 1–3 are API-only (the designer prevents them), like NDC-2758; item 4 happens through normal admin setup.

Other notes: a blueprint created by API and made active shows "Draft" in the designer header while it governs tickets; a required multi-select accepts an empty list; no blueprint name length limit.

## Incident during the run
At about 23:49 (1 Nov) the UI probe opened a second browser context from the same saved session; both refreshed the same refresh token at once and the server revoked **all** sessions of the owner account (`/login?reason=revoked`). Anyone signed in as `anyware-staging-owner@` at that moment was signed out. The scripts now use one context per sign-in and save the refreshed session back.

## Still not run (need something we do not have)
- Agent rows A2/A4–A8, D1–D8, J9, E12, and F3/F6 delivery: agent accounts.
- G6, K8, K9: a non-24×7 business-hours set (tenant-wide change — needs your OK).
- K3–K5: a customer mailbox. F5/K12, F7/K13: webhook receiver / safe custom action. N10: IM channel.
- C9–C11 Add State, C20 deleted status: create / delete permanent ticket statuses (needs your OK). K16 was run on 2 Nov (pass, `scripts/k16.js`).

### Re-check and filing, 2 Nov 2026
All four reproduced again on fresh QA records (`scripts/evid-p2.js`, `scripts/check-active.js`), then filed one ticket each (Bug, Desk, Sprint 14, label Blueprint, annotated image vs Zoho attached):
- **NDC-2761** (Medium) — warning not before the limit. New: the blueprint can be made active; tickets enter and `warning_due_at` is null (warning dropped). The designer shows "1 issue to fix before publishing" only when opened.
- **NDC-2762** (Medium) — negative limit. New: active, tickets enter with no due time; the designer shows "No limit" with no error.
- **NDC-2763** (Medium) — auto-move to another state's transition. New: active, `auto_due_at` null, ticket still at Open after 100 s (move set to 1 min); the designer shows a timer badge on the state.
- **NDC-2764** (High) — workflow rule closes a ticket in a blueprint (ticket #1067), while a direct PATCH is refused (422 BLUEPRINT_GOVERNED_FIELD).
Evidence: `evidence/annotated/BP-P2-1..4-vs-zoho.png`, raw logs `evidence/raw/P2-api.json`, `P2-active.json`. Cleanup: all 204.

## Phase 3 — approved tenant changes (2 Nov 2026, user's OK)

| Area | Spec rows | Result |
|---|---|---|
| Both overdue: department SLA (1 / 2 min) and state limit (1 min) | K16 | Pass — "SLA Violated" pill, Steps "Overdue by 2 minutes · Due 10:33", SLA card First response and Resolution "Violated" with their own due times |
| Business-hours clock: Default set to 24 hours Mon–Fri (custom 13–17 refused: "Updated business hours would invalidate existing shifts."), 5-day state on the business clock + department SLA 120 business hours on one ticket | G6, K8 | **Fail — NDC-2774 (High)**: settled values (after the provisional time is recalculated) — state "Due Sat 11:57", SLA resolution "Due 07/11/2026 11:57" with "4 days 11 hours of business time left"; Saturday is counted by both. (Correction: the first reading that the blueprint ignores business hours while the SLA does not compared a provisional value — wrong.) |
| Holiday today on the default holiday list | K9 | Pass — the holiday is skipped by the state and the SLA (count starts Tue 00:00); only the weekend is wrongly counted (NDC-2774) |
| Add State (POST /desk/blueprints/states) | C9 | Pass — status saved with type open and listed |
| Add State clash: "Open", "open", " Open ", existing QA name | C10 | Pass — 409 STATUS_EXISTS ""Open" is already a Status of type open." |
| Add State names: Arabic, emoji, script text, trailing spaces saved (trimmed); empty and 306 chars refused ("name must be 1 to 100 characters"); bad type refused | C11 | Pass (note: the Ticket statuses page allows up to 255 characters, the server 100) |
| Remove a status used by a blueprint with a ticket in that state | C20 | Pass — 422 FIELD_OPTION_IN_BLUEPRINT ""QA BP Verify" is a state of "QA BP C20b" and 1 record(s) are in it…" |
| Remove a status used by an active blueprint with no ticket in it | C20 | **Fail — NDC-2775 (Medium)**: removal accepted (200); the blueprint stays active; a transition moves ticket #1109 into "QA BP Verify", no longer a status. The designer shows "1 issue to fix before publishing · QA BP Verify is no longer a ticket status" but the published version keeps running |
| Big blueprint 30 states / 80 transitions | N8 | Pass for API (create 2.5 s, publish 2.2 s, < 5 s). Designer drew all 30 states and 80 lines, drag 0.7 s; first load took ~60 s while staging was slow — record, re-measure |

Tenant restored and verified: Default business hours back to 24×7 (field-by-field equal), QA holiday removed, Status field back to the 5 original values, every QA blueprint / ticket / SLA policy deleted (204). NDC-2753 re-check comment posted.

Agent rows (A, D, J9, E12, F3/F6) on NDC-Staging: not run — both saved passwords for ndc-staging-owner are refused ("Invalid email or password"); stopped after 3 attempts to avoid a lockout. The Anyware owner is not a member of NDC-Staging.


Filed 2 Nov: NDC-2774 (business hours count Saturday — blueprint and SLA) and NDC-2775 (removed status still used by a live blueprint), Bug, Desk, Sprint 14, label Blueprint, annotated images attached (`evidence/annotated/BP-BH-weekend-vs-zoho.png`, `BP-C20-removed-status-vs-zoho.png`).

## Status on 2 Nov 2026 (end of Phase 3) — not finished
- **Filed from this run:** NDC-2755, 2756, 2757, 2758, 2761, 2762, 2763, 2764, 2774, 2775. NDC-2753 (other reporter) still fails, re-check comment posted.
- **To compare with live Zoho (user request, 2 Nov):**
  - C3 name data classes (XSS, Arabic/emoji, trailing spaces kept, no length limit — 309 characters saved);
  - C4 duplicate name in one department (TAVI allows it);
  - K14/K15/K17 department SLA pauses in an On Hold blueprint state and resumes, reapply keeps the state, the state's own timer keeps running in On Hold;
  - L7 move to another department (TAVI: the ticket leaves the blueprint, status kept; Zoho said to refuse — confirm live).
- **Not run, now unblocked:** agent rows A2/A4–A8, D1–D8, E12, F3, F6, J9 on NDC-Staging (credentials `docs/Credentials/TAVI Desk Credentials.csv`).
- **Blocked:** K3–K5 (customer mailbox), F5/K12 (webhook receiver), F7/K13 (safe custom action), N10 (IM channel).
- **Re-measure:** N8 designer load (~60 s on slow staging).
- **Automation:** BlueprintScreenTest 5/10 (5 locator/wait fixes pending).
- Handoff with the exact plan: `NEXT.md` in this folder.

## Phase 4 — live Zoho comparison and NDC-Staging agents (2 Nov 2026)

Zoho Desk (Enterprise trial, Setup → Blueprint → Create Blueprint) checked read only: values typed and **Next** pressed, then Cancel → Discard Changes; the Zoho blueprint list was unchanged afterwards (only "Default Blueprint"). TAVI re-checked by API on Anyware (8 inactive QA drafts, all deleted). Agent rows ran on NDC-Staging, department Customer Support (QA blueprints and tickets, all deleted; 0 blueprints left). Raw: `evidence/raw/c3c4.json`, `c3-ui.json`, `ndc-agents.json`, `ndc-agents2.json`, `ndc-j9.json`, `ndc-ctrl-C.json`, `ndc-ui-agentA.json`.

| Area | Spec rows | Result |
|---|---|---|
| Name with special characters (`<script>`): Zoho refuses on Next "Special characters are not allowed."; TAVI saves it as typed (shown as plain text, no XSS) | C3 | **Differs from Zoho** — image `evidence/annotated/BP-C3-name-rules-vs-zoho.png` |
| Name length: Zoho stops typing at 60 characters (description 1000); TAVI has no limit in the designer or API (70 and 309 characters saved) | C3 | **Differs from Zoho** — same image |
| Arabic, emoji, trailing spaces in the name: accepted by both, kept as typed | C3 | Pass (same as Zoho) |
| Duplicate name in the same department: Zoho saved a second "Default Blueprint" in the same department as a draft and again on Save & Complete (active); no message. TAVI saves both too | C4 | Pass (same as Zoho, live) |
| Department SLA in an On Hold state: Zoho help says SLA timers freeze in On Hold and resume with recalculated due times (help.zoho.com … on-hold-state-use-cases-and-behavior); TAVI pauses and resumes | K14 | Pass (same as Zoho docs; not tried live in Zoho) |
| State timer in On Hold: Zoho ticket #102 in state "On Hold" (status type On Hold) with a 5-minute state SLA showed "04:59 minutes left" at 14:51 and "02:39 minutes left" at 14:54 — the state timer keeps running in On Hold. TAVI: same | K15 | Pass (same as Zoho, live) |
| SLA reapply: Zoho's ticket menu has no reapply action (Edit, Move, Share, Follow, Mark as Unread, Mark Spam, Delete, Clone, Revoke Blueprint, Apply Macro). TAVI has reapply and it keeps the blueprint state | K17 | Record — TAVI extra, nothing to compare in Zoho |
| Move a ticket in a blueprint to another department: Zoho **allows** the move (Move → Tech, "The ticket will be moved from 'Haytham Mohamed' to the 'Tech' department."); the ticket leaves the blueprint (no blueprint strip, Status unlocked), Status is reset to **Open** (was On Hold) and the owner becomes Unassigned. TAVI: move allowed, ticket leaves the blueprint, **status kept** | L7 | **Differs from Zoho** (status not reset to Open). The earlier note "Zoho refuses the move" was wrong — corrected. Not filed |
| No-permission user (Agent A, Desk Agent) opens Blueprints list / one / new by URL: "You don't have access…" / "You don't have permission to view this page"; no blueprint data requested; no Blueprints item in Setup | A2 | Pass |
| Agent A, admin API: list, one, versions, create, update, draft, publish, sort, include, revoke, delete → 403 each; blueprint unchanged | A3, A4 | Pass |
| Agent A (transition owner) sees the Steps card with "QA go for A" and no designer link | A5 | Pass |
| Agent A revokes the ticket from the blueprint by API → 403 "Missing required permission 'desk:ticket:blueprint_revoke'" (a separate permission exists — updates Z15) | A6 | Record: Desk Agent cannot revoke |
| Owner account (not an owner of the step) runs it by API → 403 BLUEPRINT_NOT_OWNER; ticket unchanged | A7 | Pass |
| Agent C (Tech) on a Customer Support ticket not shared with Tech: ticket 403, blueprint-state 403, run 404 | A8 | Pass |
| No owners: owner and Agent A both get the step | D1 | Pass (Agent B's profile can open only tickets assigned to B, so B could not be checked on A's ticket) |
| Agent owner = A: only A gets it; C and the owner get 403 BLUEPRINT_NOT_OWNER | D2 | Pass |
| Team owner (Customer Experience Specialists): team member A gets and runs it (200); the owner (not in the team) does not get it | D3 | Pass |
| Ticket owner: A (owner) gets it; after reassigning the ticket to B (Desk assign), B gets it and A does not. Changing `owner` through the records API is refused (OWNERSHIP_MANAGED_BY_DESK) | D4 | Pass |
| Department owner Tech, Full: ticket shared with Tech while in the state; C gets only that step and runs it (200), ticket moves; no share left after leaving. C cannot open the ticket page because C's profile sees only C's own tickets (control: C gets 404 on an unassigned Tech ticket) | D6, J9 | Pass |
| Department owner Read only / Restricted + required reply → save refused 422 BLUEPRINT_OWNER_CANNOT_REPLY "Tech cannot write the required reply of QA ro." | D7 | Pass |
| Restricted department owner + optional reply: C runs without a reply (200) | E12 | Pass (optional); required case refused at save (D7) |
| Notification after-action to the ticket owner: Agent A gets "QA BP AG2 … notif" with body "{{subject}}" replaced | F3 | Pass (team recipients not tried) |
| Desk email after-action to the owner + Agent B: transition runs (200), but no email record in ticket history or any API, and the mailboxes are not readable | F6 | Inconclusive |
| Owner removed / deactivated | D5 | Not run — would change shared agent accounts |
| Share limit of 10 departments | D8 | Blocked — NDC-Staging has 5 departments |

Zoho writes for C4, K15, K17 and L7 approved by the user (2 Nov): one QA blueprint (the duplicate "Default Blueprint": Open → On Hold [5-minute state SLA] → Escalated → Closed), ticket #102 and contact "QA BP Contact" were created and then deleted; the Zoho blueprint list is back to the single original "Default Blueprint". Ticket #102 and the contact sit in Zoho's Recycle Bin (with #101 from 1 Nov) until Zoho purges them.

C3 filed 2 Nov as **NDC-2780** (Low, Bug, Desk, Sprint 14, label Blueprint, image attached).

BlueprintScreenTest after fixes (2 Nov): statePanels, undoTidyAndLeave, phoneWidth, ticketFormOrder, bothOverdue — all PASS (the other 5 were not re-run after the change).

## Phase 5 — user-approved follow-ups (2 Nov 2026, afternoon)

| Area | Spec rows | Result |
|---|---|---|
| Move a ticket in a blueprint to another department: TAVI keeps the blueprint status (On Hold); Zoho resets it to Open (both leave the blueprint and unassign) | L7 | **Fail — NDC-2782 (Medium)**, image `evidence/annotated/BP-L7-move-status-vs-zoho.png` (TAVI ticket #1135, Zoho ticket #102) |
| Transition owner removed from the department (NDC-Staging, Tech; agent pobit51574 removed, then restored and verified): the agent still sees and runs the step (200) on the Tech ticket, the ticket stays assigned to them, and the blueprint re-publishes / saves as draft with no warning | D5 | Record — likely bug (a user outside the department still runs its step); not filed. Tech members restored (5, equal to before) |
| Share limit (11 other departments: 7 "QA BP Dept 1–7" created on NDC-Staging; one state with 11 steps, each owned by a different department) | D8 | Inconclusive — after the 15:10–15:24 staging outage (sign-in 502) the background worker stopped: no shares, no history entries for 3 minutes (control: F6 ticket history also frozen). The 7 QA departments are kept for a re-run |
| Desk email after-action (template "Test Email Template", subject "test {{ticket.number}} {{ticket.subject}}") to the contact madly@anyware.software, the ticket owner (Agent A) and the NDC-Staging owner; ticket #832 "QA BP F6 1335 ticket", sent 15:35 Cairo | F6 | **Pass** — re-sent at 16:15 Cairo to Desk user mahmoud.mmohamedsamy@gmail.com (ticket #837, subject "test 837 QA BP F6 1334 ticket 2 to mahmoud.mmohamedsamy"); the user confirmed the email arrived. Email delivery worked although ticket history was still frozen. F6 tickets, contact and blueprint deleted |
| Big blueprint: 30 states, 80 transitions (26 QA statuses added, then removed) | N8 | Pass — create 1.1 s, publish 2.2 s (< 5 s), designer showed 30 nodes / 80 edges in 30.9 s, drag 0.7 s. Status field back to its 5 values |
| C20 re-check during the N8 clean-up: removing a status an active blueprint uses (no ticket in it) still accepted (200) | C20 | Still fails — NDC-2775 |

## Phase 6 — webhook, custom action, IM check (3 Nov 2026, NDC-Staging, user approved)

Test receiver: webhook.site inbox (temporary, expires 9 Nov). Safe custom action: own API source "QA BP safe test receiver" + Desk action "QA BP safe ping" (POST to the inbox, no inputs, no credentials). All QA blueprints, tickets, the action and the source deleted after; NDC-Staging has 0 blueprints. Raw: `evidence/raw/f5-webhook.json`, `f7-custom-action.json`.

| Area | Spec rows | Result |
|---|---|---|
| Webhook after-action: POST arrived 4 s after the step, once, body {transitionId, toStateId, moduleKey, recordId, record{…}} | F5 | Pass. Notes: the body lacks `ticket_number` (the time-limit webhook has it) and both bodies carry an internal key `__blueprint_entry__` |
| Internal / metadata webhook URLs (169.254.169.254, localhost, 127.0.0.1, 10.0.0.1) refused at save: "Webhook Url must be a public http(s) endpoint; loopback, private, link-local, and internal hosts are not allowed." | F5 [reg NDC-2537] | Pass |
| Webhook when the state's time runs out (1-minute limit): POST arrived once, transitionId "sla:Escalated" | K12 | Pass |
| Custom action as step after-action: runs once (request at the receiver 6 s after the step) | F7 | Pass |
| Custom action refused at save: disabled action ("Custom action 'QA BP safe ping' is not active.") and CRM-only action ("Custom action 'NDC agency profile' is not available in desk.", reason custom_action_not_for_app) | F7 | Pass (record-bound case not tried — no record-bound Desk action) |
| Custom action at the state **warning** (2-minute limit, warning 1 minute before): never ran (warning due 08:15:16, nothing by 08:18). Control: a **webhook** at the warning also never ran (due ~08:19:26), while a custom action when the time runs out **did** run (08:20:46) | K13 | **Fail — warning actions do not run** (any kind). Not filed yet; staging was degraded since 2 Nov 15:10 (time-limit actions fire, so the timer runs) — re-check once staging is healthy, then file |
| IM ticket with a required-reply step: the build supports IM (WhatsApp, Messenger, Instagram, Telegram, Web chat; "Instant message sent" history), but NDC-Staging has no IM channel (`/desk/im-options` → whatsapp []) and no department has a chat widget; the only "chat" ticket (#399) is a QA ticket with the Channel field set by hand, not a conversation | N10 | Blocked — needs an IM channel or chat widget connected |
| Leftovers from 2 Nov (D8 test ticket + blueprint) | — | Deleted 3 Nov 09:58 |
| D8 share limit | D8 | Still waiting — background processing (history, shares) still frozen on 3 Nov morning; 7 "QA BP Dept 1–7" departments kept |
| Anyware owner sign-in | — | 403 on 3 Nov morning (not retried); a possible "QA BP write probe" ticket on Anyware could not be checked |

### Phase 6 — update (3 Nov, after staging recovered)

| Area | Spec rows | Result |
|---|---|---|
| Share limit: one state with 11 steps, each owned by a different other department → ticket shared with exactly 10 departments; the 11th ("QA BP Dept 3") skipped; history `ticket.blueprint_share_skipped` | D8 | **Pass** (note: the history entry's details are empty, so it does not name the skipped department). The 7 "QA BP Dept 1–7" departments deleted (transfer to Customer Support); NDC-Staging back to its 5 departments |
| Warning action re-check on healthy staging (2-minute limit, warning 1 minute before): warning webhook due 09:00:14 never arrived; the time-ran-out webhook arrived 09:01:48 | K13 | **Fail — NDC-2788 (High)**: actions set at the state warning never run (webhook or custom action). Different from NDC-2761. Image `evidence/annotated/BP-K13-warning-actions-vs-zoho.png` |
| D5 live Zoho check | D5 | Blocked — creating the second Zoho agent was refused by the local safety check (adding a user to an external service needs explicit permission); the form was cancelled, nothing created in Zoho |
| IM / live chat | N10 | Available through the separate Omni Channel app: NDC-Staging has one enabled chat widget "NDC Staging" (`GET /desk/departments/chat-widgets`), not linked to any Desk department. Testing N10 needs: link a department's Live chat widget, start a chat as a visitor, turn it into a Desk ticket, run a required-reply step |
| IM ticket + required-reply step: NDC-Staging chat widget "NDC Staging" (Omni Channel) linked to Customer Support for the test; a visitor chat from a local test page ("QA BP N10 test - please ignore", queued as missed — no operator online) converted to Desk ticket **#889** (channel "chat") with `POST /salesiq/conversations/{id}/desk-ticket` after giving the visitor an identity (missing_identity otherwise). A blueprint step with a required reply then ran (200) — the reply requires `to: [email]` and was sent as an **email reply** ("Re: QA BP N10 chat ticket" to the contact's email); **nothing was posted into the chat** and no "Instant message sent" history entry | N10 | **Differs from Zoho** (Zoho opens the IM reply, so the reply goes back into the chat). Not filed. Cleaned up: chat closed, visitor email cleared, ticket #889 + contact + blueprint deleted, Customer Support unlinked from the widget |
