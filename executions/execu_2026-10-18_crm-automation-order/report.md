# CRM Automation Execution Order — test run, 18–19 Oct 2026

- **App:** TAVI CRM staging, `https://staging-crm.taviportal.com`, tenant NDC-Staging. API level (Java 21 + TestNG + RestAssured, `automation/` feature `crmautomationorder`), no browser.
- **Order under test:** Assignment Rules → Review Process → Workflow Rules (+ actions) → Approval Process → Blueprint, on Leads, Deals and Tasks.
- **Spec:** `docs/crm-automation-execution-order/spec-crm-automation-execution-order.md`. **Gaps:** filed as Plane **NDC-2294** (`crm-automation-missing-list.md`).
- **Reference:** Zoho CRM (org943261092, full edition) and the Zoho help pages in `docs/crm-automation-execution-order/reference/zoho-docs-inventory.md`.
- **HTML for the team:** `bug-report.html` (confirmed bugs only). **Evidence:** `evidence/` (15 images, TAVI left vs Zoho right). **Logs:** `runs/` (final TSV of 18 Oct, `crm-verify.log` of 19 Oct).
- **Plane:** nothing filed. Lead `ae8c5739` and the fixed layout `LEADS_QA_LAYOUT` were not touched (waiting for your decision).

## Accounts (profiles only)

| Account | Profile | Used as |
|---|---|---|
| ndc-staging-owner | Owner | only where the Owner profile was needed: status reset in cleanup, K-09 |
| mmohamed | CRM Admin | process admin, importer, reviewer |
| mahmoud.mahamed1515 | CRM Admin + Desk Administrator | process admin, assigned owner |
| mahmoud.mmohamedsamy | Supervisor | approver; manager of valafo4080 |
| nameb56175 | User | submitter / record owner |
| valafo4080 | "test" (has `workflow:approval:admin`) | submitter |

## Run history

| Run | Date | Passed | Failed | Inconclusive | Not run | Notes |
|---|---|---|---|---|---|---|
| Run 1 | 18 Oct | 71 | 35 | 81 | – | Many skips: HTTP 429 sign-in rate limit with 6 parallel JVMs; fixed by one JVM and one sign-in per account |
| Run 2 | 18 Oct | 117 | 37 | 33 | – | Suite `crm-order`, one JVM, 3 parallel classes |
| Run 2 + 3 (final) | 18 Oct | **129** | **35** | **20** | **3** | Run 3 re-ran the inconclusive / harness-broken cases (`target/crm-order-final.tsv`) |
| Re-verification | 19 Oct | – | – | – | – | Every candidate bug re-run alone: suites `crm-verify` (30 cases, 25 min) and `crm-verify2` (9 cases), plus the original G-13 once |

**After re-verification the 35 failures are:** 15 confirmed app-bug rows (A-04, C-11, C-12, D-21, E-09, E-13, F-01, F-03, F-20, G-04, G-07, G-16, H-02, H-03, H-05), 6 not a bug, 5 test defects, 1 inconclusive (H-04), 8 known gaps (Z2–Z9, NDC-2294). Re-verification also found a bug in a case that had passed (C-14 → B-11) and showed that C-11, H-05 and C-15 share one root cause (B-12). **Final: 15 bugs, B-01 … B-15; B-03 withdrawn 19 Oct by the user → 14.**

## How the re-verification was done (19 Oct)

- New classes `VerifyV1AssignImportTest`, `VerifyV2WorkflowTest`, `VerifyV3ApprovalBlueprintTest`, `VerifyV4SlaTest`, `VerifyV5FollowUpTest` (+ `VerifyBase`), suites `crm-verify.xml` / `crm-verify2.xml`. One JVM per suite and one API sign-in per account; no HTTP 429.
- Each case built its own minimal setup: one process of each type it needed, on a fresh restricted QA layout ("QA AEO Layout V1…V5", deleted after), names `QA AEO V<n> <case> …`. Negative assertions have a control record next to them.
- Every read is a 2xx-checked API call; every request and response is in `crm-verify.log` (tokens travel in headers and are never logged).
- Cases record facts (`FACT` lines) instead of asserting; the verdicts below were decided against Zoho's documented behaviour.

## Per-group summary (final run, 18 Oct)

| Group | Passed | Failed | Inconcl. | Not run | After re-verification |
|---|---|---|---|---|---|
| A Assignment | 12 | 2 | 2 | 2 | A-04 → B-07; A-08 not a bug |
| B Review | 19 | 0 | 3 | 0 | – |
| C Workflow | 16 | 3 | 0 | 0 | C-11 → B-12, C-12 → B-08, C-09 not a bug; C-14 (passed) → B-11 |
| D Approval | 17 | 4 | 0 | 0 | D-21 → B-01; D-05 test defect; D-06, D-17 not a bug |
| E Blueprint | 12 | 4 | 2 | 0 | E-09 → B-15, E-13 → B-09; E-15, E-18 test defects |
| F Hand-offs | 20 | 3 | 1 | 0 | F-01 → B-05, F-03 → B-04, F-20 → B-14 |
| G Chains | 7 | 4 | 7 | 0 | G-04 → B-06, G-07 → B-03 (withdrawn), G-16 → B-10; G-13 not reproducible |
| H Conversion | 1 | 4 | 2 | 0 | H-02 → B-02, H-03 → B-01, H-05 → B-13 (+B-12); H-04 inconclusive |
| I Edge cases | 9 | 0 | 1 | 0 | – |
| J Tasks | 2 | 1 | 0 | 1 | J-01 test defect |
| K Regression | 9 | 1 | 1 | 0 | K-09 not a bug |
| E2E | 4 | 1 | 1 | 0 | E2E-5 test defect |
| Z Gaps | 1 | 8 | 0 | 0 | Z2–Z9 = NDC-2294 items 2–9 |

## Confirmed bugs (not filed in Plane)

| Bug | Case | Severity (suggested) | Summary | Records (19 Oct / 18 Oct) |
|---|---|---|---|---|
| B-01 | D-21, H-03 | High | A lead waiting for approval can be converted (Delete refused, Convert 200) | fe605f05 / 96850232, ba3a146a |
| B-02 | H-02 | High | A lead held for review can be converted (Edit 422 REVIEW_LOCKED, Convert 200) | da6f6b7c / 22d5679b |
| ~~B-03~~ | G-07 | Withdrawn | **Withdrawn 19 Oct (user):** review must never run on edit, so the defect is that the edit sent existing leads into review; the user files that separately. Original title: "An edit held by review never runs the On Edit workflow after approval" | 621270ac, 30ce81a7, control c59f5605 / ff27395f; rerun 19 Oct 7c38a882, 3e7ceb20, control 7c7d6a4c (still reproduces) |
| B-04 | F-03 | Medium | Approver "Record Owner" ignores the owner set by the assignment rule on import (goes to the process admin) | def2dce5, control 47de0f97 / 7b58cefa |
| B-05 | F-01 | Medium | Reviewer "Record owner" is empty on an imported, assigned lead | 50ae5e2d, control bc726dc7 / 2a1279ac |
| B-06 (NDC-2302) | G-04 | Medium | Import with "Trigger automation" off: review still holds the lead, and approving it runs the workflow | 3dbedc30, control a3221c31 / 224a4501 |
| B-07 | A-04 | Low | An assignment rule limited to the Api channel still assigns imported leads | c1501594, control 65b71474 / 51ddddf2 |
| B-08 | C-12 | Medium | A workflow field update does not trigger On Edit rules (Zoho chains, loop guard 3) | 23c906c8, control dec908d9 / d99b23d6 |
| B-09 | E-13 | Medium | A record excluded from a blueprint keeps its blueprint field locked | bb67fa6e / 66c008ba |
| B-10 | G-16 | Low | Timeline: no workflow update or blueprint entry rows; assignment shown as "System" | 4115e483 / d31541d8 |
| B-11 | C-14 | Low | 25 conditions refused ("this one has 26"): the And group is counted | API only |
| B-12 | C-11, H-05, C-15 | High | A scheduled (delayed) Field Update runs immediately (delay 300 s stored, applied at +3 s) | C-11d lead of 07:25:47 / 3e3fcd8a, ba12d70d, ce1972c8 |
| B-13 | H-05 | Medium | Pending scheduled actions still run on a converted lead (delayed webhook fired after conversion) | 64684edc, control 8165e04f |
| B-14 | F-20 | High | Editing a deal in a blueprint starts an approval and removes the deal from the blueprint | 3e2736e6, control 0066a926 / 0f39949c |
| B-15 | E-09 | Medium | A blueprint state SLA never escalates (1-min SLA watched 25 min; slaDueAt then cleared) | 76d0f582 / eb276a1a, c38ff8fb |

Steps, expected (Zoho) and actual for each are in `bug-report.html`; images in `evidence/B-NN-…-vs-zoho.png`.

## Reclassified: not a bug / test defect

| Case | Verdict | Reason |
|---|---|---|
| A-08 | Not a bug | Fallback "Leave unassigned" leaves the lead without owner, exactly as the option says (execution `SkippedNoMatch`, lead a827e5bd). Zoho has no such option ("any record entering CRM must have an owner"): a parity question at most. |
| C-09 | Not a bug | No execution row is written when a rule's criteria are false (lead 18c0a72a). Zoho does not log non-matches either; the spec expectation was too strict. |
| C-10 / I-10 (403 notes) | Not a bug (not reproducible) | userN edited its own lead 200 plain, after an admin tag, after removing it, and 2 s after review approval (leads 1e46c306, 07e43945). One edit right after approval got 422 REVIEW_LOCKED once (lead 47735db2). |
| D-05 | Test defect | Resubmit with no matching rule does release the record: outcome `released`, approval_status `not_submitted`, edit 200, delete 204 (lead 1c29604f). The test read the old instance's `state` ("rejected"). Worth a UI look: the status endpoint keeps showing the old instance as `rejected`. |
| D-06 / isProcessAdmin | Not a bug | valafo4080's profile "test" holds `workflow:approval:admin`, so `isProcessAdmin=true` is right and a process admin may decide. A plain approver who submitted the record (userN) is blocked: 403, `not_an_approver`. Product question only: may profile-level approval admins approve their own submission? |
| D-17 | Not a bug | Deleting an approval process with pending records → 409 with a clear message ("deactivate it instead"). Zoho's pages conflict (unlocked vs still locked); TAVI's review process does the same. Design choice. |
| E-15 / J-01 / E2E-5 | Test defect | Tasks `status` is datatype `status`, not `pick_list`, so the blueprint validator refuses it; a Tasks blueprint on Priority works end to end. Blueprints on Tasks are not confirmed in Zoho either. |
| E-18 | Test defect | `PATCH /modules/{m}/blueprints/sort` needs `{"items":[{"id","sort_order"}]}`; the test sent `{"ids":[…]}` (204, ignored). With the right body the new first blueprint governs the next record. Note: no reorder control for blueprints in the UI (Zoho can reorder) — possible gap. |
| G-13 | Not a bug (not reproducible) | Deals import with the rule assigns the owner in a minimal run, with a review hold, and in the original test re-run on 19 Oct (deal 054bcdcf). The 18 Oct failure (a643f3dd) did not come back. |
| K-09 (Owner edit) | Not a bug | Approval Status is system-managed; a hand edit answers 422 APPROVAL_STATUS_READ_ONLY "use the approval status reset action", and the Owner's reset works (D-18). |
| Records list sort | Test defect | The API takes `sort_dir`, not `sort_order`: `sort_by=created_at&sort_dir=desc` is newest first. |
| Required Phone skipped | Not a bug | Only for valafo4080, whose profile has Phone read-only; userN without Phone gets 422 "Phone is required". The server skips required checks on fields the user may not write — a configuration conflict, not a defect. |
| C-14 "one Field Update per rule" | Not a bug | Two FieldUpdate actions are refused, but one action can update several fields (201). |
| Z2 | Gap (NDC-2294 #2) | Manual approval of imported records is "Coming soon"; the API accepts `manual_approval=true` silently. |

## Inconclusive and blocked — what is needed

| Case | Why | Request |
|---|---|---|
| H-04 | A lead in a blueprint converts (200, lead bf10dce6). Zoho does not document whether Convert is allowed outside a Convert transition. | Product decision: may a governed lead be converted outside the blueprint? |
| A-02 web form, E2E-1, G-08 | Public web-form session answers 404 | Fix/enable the public web-form endpoint on staging, or give a working form URL |
| B-19, G-02, G-12, G-15, G-18 | No real API channel (API key / integration): a user-token create is `source: manual` | An API key or integration user for NDC-Staging |
| A-13, G-05 | Leads has no unique field, so an update-mode import cannot match | OK to mark a field unique on a QA layout |
| B-13 (review SLA) | Minimum review SLA is 1 hour | OK to run a 1-hour watch |
| B-22 | Only one review process per module + layout, so first-match ordering cannot be observed | None (design) |
| E-04 | After-transition email not visible (no inbox) | A test mailbox |
| E-16 | Related-To label is UI-only (NDC-1328) | UI check in a browser session |
| F-02 | Owner criterion never matched in the control | Re-run with a different owner user |
| G-10 | Blueprint "Create record" after-action not offered (NDC-2294 #9) | – |
| H-01, H-07 | Conversion made no Deal; no mass-convert endpoint | Lead conversion mapping with a Deal, and the mass-convert route |
| I-09 | Held records cannot be deleted by anyone | Expected; restore part untestable |
| K-09 (layout) | approval_status not found in the layout JSON | UI check of the layout builder |
| A-10, A-17, J-04 (not run) | Need a reliably signed-out user / deactivating a shared user / Tasks status "Completed" (teammate rule) | Your OK for each |

## Gaps → NDC-2294

Z2 import manual approval, Z3 score/notes triggers, Z4 meeting/call/function/connected-record actions, Z5 owner assignment by assignment rule, Z6 review function hooks, Z7 approver Anyone/Everyone, Z8 approval Call Function, Z9 blueprint Convert/Function/Tags/Create-record after-actions. Not re-verified (known). Possible new gap items from this run: no blueprint reorder in the UI (E-18), "Leave unassigned" fallback vs Zoho's always-an-owner (A-08).

## Evidence

- `evidence/B-01…B-15-…-vs-zoho.png`: TAVI on the left (annotated rendering of the real request/response from `crm-verify.log`, red boxes on the key lines), Zoho on the right.
- The Zoho side is Zoho help text (flagged "ZOHO DOCS — not seen on screen"): each bug needs a record in a state (pending approval, held review, scheduled action, breached SLA…) that cannot be produced in the live Zoho org without saving data there, which the read-only rule forbids. No TAVI UI screenshots were taken: all 15 bugs show in the API, and every record was deleted after the run.
- Generators: `evidence/src/bugs.js` (+ `bugs-data.js`, `make-api-shot.js`, `make-evidence.js`) and `evidence/src/make-bug-report.js` (+ `bug-entries.js`).

## Cleanup proof

- Each case removed its processes and records; pending-approval records were released by an Owner status reset before deletion; converted Contacts/Subscriptions were deleted (10 × 200/204); test tags deleted.
- One leftover from the first verification run — lead da6f6b7c (converted while held for review, so REVIEW_LOCKED) and its layout — was removed in V5 (`zzCleanupFirstRun`: delete 204, layout delete 204). This is part of B-02: a converted held lead cannot be deleted until its review is rejected.
- **Final read-only check, 19 Oct 2026 07:36 UTC** (mmohamed, `GET` only): assignment rules 9 total / 0 "QA AEO"; review processes 4 / 0; workflow rules 14 / 0; approval processes 18 / 0; Leads, Deals, Tasks: 0 QA blueprints, 0 "QA AEO" layouts, 0 "QA AEO V…" records in the newest 300 of each; review queue 0.

## Full per-case table (final run + re-verification)

"Run 2/3" is the verdict of 18 Oct; "After verification" changes only the FAIL rows. Record ids are shortened to 8 characters.

| Case | Test | Run 2/3 | After verification | Record | Note |
|---|---|---|---|---|---|
| A-01 | ruleAppliesToLeadCreatedThroughApi | PASS | PASS | leads:082f5aeb |  |
| A-02 | importChoosingRuleAssignsOwner | PASS | PASS | leads:2cf3a71a |  |
| A-02 | webFormSubmissionAssignsOwnerByRule | INCONCLUSIVE | INCONCLUSIVE |  | INCONCLUSIVE: public web-form session not issued: 404 |
| A-03 | manualCreateDoesNotRunRule | PASS | PASS | leads:3e1bc3d1 |  |
| A-04 | ruleWithoutImportChannelNotAppliedToImport | FAIL | CONFIRMED B-07 | leads:51ddddf2 | Api-only rule applied to import (19 Oct lead c1501594) |
| A-05 | firstMatchingEntryWins | PASS | PASS | leads:d35465fa |  |
| A-06 | nonMatchingFallsToSecondEntry | PASS | PASS | leads:fdb5164b |  |
| A-07 | fallbackDefaultUser | PASS | PASS | leads:6079db58 |  |
| A-08 | fallbackLeaveUnassigned | FAIL | NOT A BUG | leads:2f242e7b | fallback 'Leave unassigned' does what it says (SkippedNoMatch, owner empty; lead a827e5bd). Zoho has no such option: parity note |
| A-09 | roundRobinAlternates | PASS | PASS | leads:a65e993f |  |
| A-10 | onlineStatusSkipsSignedOutUser | NOT RUN | NOT RUN |  | NOT RUN: needs a target user who is reliably signed out; userN/userV are signed in by parallel sessions and signing users out touches shared accounts |
| A-11 | followUpTaskForNewOwner | PASS | PASS | leads:ea48eb6f |  |
| A-12 | inactiveRuleNotApplied | PASS | PASS | leads:7eb74424 |  |
| A-13 | updateImportDoesNotReassign | INCONCLUSIVE | INCONCLUSIVE |  | INCONCLUSIVE: Leads has no unique field, so an update-mode import cannot match an existing lead |
| A-14 | dealsRuleApplied | PASS | PASS | deals:597bc86f |  |
| A-15 | tasksRuleApplied | PASS | PASS | tasks:29ae61ee |  |
| A-16 | editDoesNotReassign | PASS | PASS | leads:fed7252b |  |
| A-17 | deactivatedUserSkipped | NOT RUN | NOT RUN |  | NOT RUN – needs user OK: deactivating a user changes a shared account |
| B-01 | manualCreateIsHeldFrozenHiddenAndQueuedForReviewer | PASS | PASS | leads:a086eb92 |  |
| B-02 | manualChannelOffIsNotHeld | PASS | PASS | leads:d26b14e8 |  |
| B-03 | criteriaFalseIsNotHeld | PASS | PASS | leads:bda60791 |  |
| B-04 | approveBothFieldsReleases | PASS | PASS | leads:3063a320 |  |
| B-05 | rejectOneFieldRejectsRecordAndSubmitterSeesReason | PASS | PASS | leads:17da66b1 |  |
| B-06 | editRejectedFieldThenResubmit | PASS | PASS | leads:f5de2968 |  |
| B-07 | editWhilePendingIsBlocked | PASS | PASS | leads:996c9b29 |  |
| B-08 | editRejectedWithoutResubmitStaysRejected | PASS | PASS | leads:b7558633 |  |
| B-09 | rejectWithoutReasonIsRefused | PASS | PASS | leads:b42333e3 |  |
| B-10 | noRuleMatchGoesToOthers | PASS | PASS | leads:61804f5c |  |
| B-11 | userWithoutPermissionCannotAct | PASS | PASS | leads:5589ec2c |  |
| B-12 | delegateToOtherReviewer | PASS | PASS | leads:2a8ebc2e |  |
| B-13 | slaEscalationNotifiesRecipient | INCONCLUSIVE | INCONCLUSIVE | leads:130a8738 | INCONCLUSIVE: SLA below 1 hour is refused (400 SLA duration must be between 1 hour and 90 days); 60-min SLA stored, slaDueAt=2026-10-18T18:26:40.415921+00:00 —  |
| B-14 | deactivateRejectAll | PASS | PASS | leads:e033b010 |  |
| B-15 | deactivateReleaseUnreviewed | PASS | PASS | leads:e0ad962b |  |
| B-16 | deleteProcessHoldingRecordsIsRefused | PASS | PASS | leads:ca0aae54 |  |
| B-17 | workflowCreatedLeadIsHeld | PASS | PASS | leads:d09ca823 |  |
| B-18 | importedLeadIsHeld | PASS | PASS | leads:55baf609 |  |
| B-19 | apiChannel | INCONCLUSIVE | INCONCLUSIVE | leads:7f50a6c9 | INCONCLUSIVE: no real API channel (API key / integration) available: a user-token create is source=manual, review=null; process with the api channel shows legac |
| B-20 | editApprovedLeadReentersReview | PASS | PASS | leads:66894776 |  |
| B-21 | dealIsHeld | PASS | PASS | deals:61668281 |  |
| B-22 | reorderProcesses | INCONCLUSIVE | INCONCLUSIVE | leads:a1019eee | INCONCLUSIVE: reorder saved (p1 4→1, p2 5→0) but first-match-wins is not observable: only one process may cover a module+layout |
| C-01 | onCreateFieldUpdateSetsValueOnce | PASS | PASS | leads:5d0e2bb7 |  |
| C-02 | onEditRuleDoesNotFireOnCreate | PASS | PASS | leads:4ef78509 |  |
| C-03 | onEditRuleFiresOnEdit | PASS | PASS | leads:ea2bc414 |  |
| C-04 | createOrEditRecurringFiresThreeTimes | PASS | PASS | leads:ce99ca33 |  |
| C-05 | createOrEditOneTimeFiresOnce | PASS | PASS | leads:0f2bf6df |  |
| C-06 | fieldChangedFiresOnlyOnThatField | PASS | PASS | leads:959ecacf |  |
| C-07 | onDeleteWebhookFiresAndFieldUpdateRefused | PASS | PASS |  |  |
| C-08 | dateTimeTriggerFiresAtTime | PASS | PASS | leads:0026c783 |  |
| C-09 | criteriaFalseDoesNotFire | FAIL | NOT A BUG | leads:4f28fae2 | no execution row when criteria are false; Zoho logs none either (lead 18c0a72a) |
| C-10 | eachActionTypeRuns | PASS | PASS | leads:1cc81081 |  |
| C-11 | scheduledActionCancelledWhenNoLongerMatching | FAIL | CONFIRMED B-12 | leads:3e3fcd8a | root cause: delayed Field Update applied at once; cancellation itself works for a delayed webhook (C-11w) |
| C-12 | fieldUpdateChainsToAnotherRule | FAIL | CONFIRMED B-08 | leads:d99b23d6 | field update never triggers On Edit rule (lead 23c906c8); Zoho chains rules |
| C-13 | loopStops | PASS | PASS | leads:66bc6ad3 |  |
| C-14 | limitsAreEnforced | PASS | PASS |  |  |
| C-15 | deactivateWithPendingScheduledActions | PASS | PASS | leads:ce1972c8 |  |
| C-16 | massUpdateFiresForEach | PASS | PASS | leads:266e64e4 |  |
| C-17 | inlineEditFiresAsEdit | PASS | PASS | leads:e6eb8b69 |  |
| C-18 | dealsAndTasksOnCreateFire | PASS | PASS | tasks:7028ea5e |  |
| C-19 | ruleOrderFollowsTheList | PASS | PASS | leads:4745e51f |  |
| D-01 | d01MatchingLeadGoesToSubmitterManager | PASS | PASS | leads:4f8a31e0 |  |
| D-02 | d02ApproveRunsFinalActions | PASS | PASS | leads:5c283711 |  |
| D-03 | d03RejectWithCommentOffersResubmit | PASS | PASS | leads:829e17db |  |
| D-04 | d04ResubmitAfterEdit | PASS | PASS | leads:0e05549a |  |
| D-05 | d05ResubmitWithNoMatchReleases | FAIL | TEST DEFECT | leads:a0aaa4d5 | resubmit released the record (outcome released, approval_status not_submitted, edit 200, delete 204, lead 1c29604f); test read the old instance state |
| D-06 | d06SubmitterCannotApproveOwnRecord | FAIL | NOT A BUG | leads:fcac7db7 | valafo4080's profile 'test' has workflow:approval:admin, so it is a process admin; a plain approver (userN) is blocked 403 not_an_approver |
| D-07 | d07NoFieldsEditableWhilePending | PASS | PASS | leads:df39b6f8 |  |
| D-08 | d08SpecificFieldsEditableWhilePending | PASS | PASS | leads:8802069b |  |
| D-09 | d09ApprovedRecordEditDoesNotReenter | PASS | PASS | leads:8561a4a7 |  |
| D-10 | d10ResetFieldSendsBackForApproval | PASS | PASS | leads:1cf82c67 |  |
| D-11 | d11TwoLevels | PASS | PASS | leads:741e6e38 |  |
| D-12 | d12Delegate | PASS | PASS | leads:c014ee8c |  |
| D-13 | d13AdminTakeover | PASS | PASS | leads:951246c7 |  |
| D-14 | d14CreateOnlyIgnoresEdit | PASS | PASS | leads:6bedbec9 |  |
| D-15 | d15EditOnlyIgnoresCreate | PASS | PASS | leads:466d9842 |  |
| D-16 | d16DeactivateWithPending | PASS | PASS | leads:1d20d02e |  |
| D-17 | d17DeleteWithPending | FAIL | NOT A BUG |  | 409 with a clear message is a design choice; Zoho docs conflict; TAVI review does the same |
| D-18 | d18ApprovalStatusEditPermission | PASS | PASS | leads:7f35f408 |  |
| D-19 | d19Deals | PASS | PASS | deals:f2ee8184 |  |
| D-20 | d20Tasks | PASS | PASS | tasks:f58c804e |  |
| D-21 | d21ConvertDeletePendingBlocked | FAIL | CONFIRMED B-01 |  | convert 200 while pending approval (lead fe605f05) |
| E-01 | e01MatchingLeadEntersAtStartState | PASS | PASS | leads:4ff930a8 |  |
| E-02 | e02EntryCriteriaFalseNotGoverned | PASS | PASS | leads:e73a50e1 |  |
| E-03 | e03RequiredDuringFieldEmptyBlocked | PASS | PASS | leads:f2c89d1d |  |
| E-04 | e04FilledTransitionRunsAfterActions | INCONCLUSIVE | INCONCLUSIVE | leads:c8f18f88 | INCONCLUSIVE: state moved, field update and task ran; the After email is not visible in the Timeline (no inbox) - lead c8f18f88-5f6f-4ac5-9bb4-58a5227f5a4e |
| E-05 | e05TransitionOwnerOnly | PASS | PASS | leads:d811b456 |  |
| E-06 | e06DirectEditBlocked | PASS | PASS | leads:dd8f19da |  |
| E-07 | e07WorkflowOverridesGovernedField | PASS | PASS | leads:dd54b11e |  |
| E-08 | e08AutomaticTransition | PASS | PASS | leads:d02881cc |  |
| E-09 | e09StateSlaEscalation | FAIL | CONFIRMED B-15 | leads:c38ff8fb | 1-min SLA not escalated in 25 min (lead 76d0f582) |
| E-10 | e10CommonTransition | PASS | PASS | leads:4b0e77eb |  |
| E-11 | e11ParallelTransition | PASS | PASS | leads:5944a6a5 |  |
| E-12 | e12DraftFollowsPublishedUntilPublish | PASS | PASS | leads:0cc60de5 |  |
| E-13 | e13MassExcludeOne | FAIL | CONFIRMED B-09 | leads:66c008ba | excluded lead's Lead Source still 422 BLUEPRINT_GOVERNED_FIELD (lead bb67fa6e) |
| E-14 | e14DealsStageNeedsPipeline | PASS | PASS | deals:84325b85 |  |
| E-15 | e15TasksBlueprintOnStatus | FAIL | TEST DEFECT | tasks:65d85bdb | Tasks 'status' has datatype 'status', not pick_list; blueprint on Priority works. Zoho Tasks blueprint unconfirmed |
| E-16 | e16AfterTaskRelatedToShowsName | INCONCLUSIVE | INCONCLUSIVE | leads:2cb9eea3 | INCONCLUSIVE: runtime OK: task 3b07e621-de5f-4879-82ac-d06274e38030 related_to=841043e1-c078-41f9-8d6e-dfd61bee45c3:9066c5fa-a871-4352-9649-729ea92fa37d resolve |
| E-17 | e17AddressFieldUpdateKeepsSubfields | PASS | PASS | leads:84109e56 |  |
| E-18 | e18TwoBlueprintsFirstWins | FAIL | TEST DEFECT | leads:6214933a | /sort needs {items:[{id,sort_order}]}; with it the new first blueprint governs (V5). No reorder UI for blueprints |
| E2E-1 | e2e1WebLeadHappyPath | INCONCLUSIVE | INCONCLUSIVE |  | INCONCLUSIVE: public web-form session not issued: 404 |
| E2E-2 | e2e2ImportReviewRejectRecover | PASS | PASS | leads:8b2e65ad |  |
| E2E-3 | e2e3ApprovalRejectRecover | PASS | PASS | leads:854d5165 |  |
| E2E-4 | e2e4DealPipeline | PASS | PASS | deals:aa51f3f4 |  |
| E2E-5 | e2e5TaskApproval | FAIL | TEST DEFECT | tasks:aaa84a6e | same as E-15 (blueprint on Tasks status) |
| E2E-6 | e2e6DeactivateReviewMidFlight | PASS | PASS | leads:b9a2d12e |  |
| F-01 | f01AssignmentBeforeReviewRecordOwnerReviewer | FAIL | CONFIRMED B-05 | leads:2a1279ac | record_owner reviewer empty on import (lead 50ae5e2d) |
| F-02 | f02AssignmentBeforeWorkflowOwnerCriteria | INCONCLUSIVE | INCONCLUSIVE | 3445ec4a-020e-4f12-b156-dd2de7610164 | INCONCLUSIVE: control: Owner = adminB criterion never matched a lead owned by adminB (owner 3445ec4a-020e-4f12-b156-dd2de7610164) |
| F-03 | f03AssignmentBeforeApprovalRecordOwnerApprover | FAIL | CONFIRMED B-04 | leads:7b58cefa | approver = process admin, not the assigned owner (lead def2dce5) |
| F-04 | f04AssignmentBeforeBlueprintOwnerTransition | PASS | PASS | deals:b1e34a0c |  |
| F-05 | f05NoWorkflowWhileReviewPending | PASS | PASS | leads:2e606d73 |  |
| F-06 | f06WorkflowOnceAfterReviewApproval | PASS | PASS | leads:90b4a774 |  |
| F-07 | f07RejectedEditDoesNotReleaseToWorkflow | PASS | PASS | leads:1a1ec923 |  |
| F-08 | f08WorkflowOnceAfterResubmitApproval | PASS | PASS | leads:4f4e3330 |  |
| F-09 | f09NoApprovalWhileReviewPending | PASS | PASS | leads:5733d12e |  |
| F-10 | f10ApprovalAfterReviewApproval | PASS | PASS | leads:5c7aae8b |  |
| F-11 | f11RejectedEditDoesNotReleaseToApproval | PASS | PASS | leads:59a43e3f |  |
| F-12 | f12NoBlueprintWhileReviewPending | PASS | PASS | deals:47e6aec5 |  |
| F-13 | f13BlueprintAfterReviewApproval | PASS | PASS | deals:d6effe6f |  |
| F-14 | f14WorkflowUpdateFeedsApproval | PASS | PASS | leads:eacb27cf |  |
| F-15 | f15WorkflowUpdateStopsApproval | PASS | PASS | leads:c43d38bc |  |
| F-16 | f16WorkflowUpdateFeedsBlueprint | PASS | PASS | deals:5d982a5f |  |
| F-17 | f17NoBlueprintWhileApprovalPending | PASS | PASS | deals:5c440088 |  |
| F-18 | f18BlueprintAfterApproval | PASS | PASS | deals:c8a8f4b5 |  |
| F-19 | f19RejectedApprovalNeverGoverned | PASS | PASS | deals:aecca3b2 |  |
| F-20 | f20BlueprintRecordEditedToMatchApproval | FAIL | CONFIRMED B-14 | deals:0f39949c | approval starts and the deal leaves the blueprint (deal 3e2736e6) |
| F-21 | f21WorkflowCreatedRecordHeldForReview | PASS | PASS | leads:29a6885d |  |
| F-22 | f22AssignmentThenApprovalNoStall | PASS | PASS | leads:2d75cede |  |
| F-23 | f23ReviewThenBlueprintNoStall | PASS | PASS | deals:3c6b502d |  |
| F-24 | f24WorkflowThenBlueprintNoStall | PASS | PASS | deals:8b3cc1ba |  |
| G-01 | g01LeadsUiCreate | PASS | PASS | leads:c51e7ef0 |  |
| G-02 | g02LeadsApiCreate | INCONCLUSIVE | INCONCLUSIVE | leads:2f9c5745 | INCONCLUSIVE: no API channel: a records-API create has source 'manual', so the assignment stage cannot run; review → workflow → approval → blueprint ran in orde |
| G-03 | g03LeadsImportTriggerOn | PASS | PASS | leads:79c07e13 |  |
| G-04 | g04LeadsImportTriggerOff | FAIL | CONFIRMED B-06 | leads:224a4501 | narrowed: trigger off works without review; through review the workflow runs (lead 3dbedc30) |
| G-05 | g05LeadsImportUpdate | INCONCLUSIVE | INCONCLUSIVE |  | INCONCLUSIVE: Leads has no unique field, so an update-mode import cannot match an existing lead |
| G-06 | g06LeadsClone | PASS | PASS | leads:1285c410 |  |
| G-07 | g07LeadsMassUpdate | FAIL | WITHDRAWN B-03 | leads:ff27395f | real defect: edit sent existing leads into review (user files it) (leads 621270ac, 30ce81a7) |
| G-08 | g08LeadsWebForm | INCONCLUSIVE | INCONCLUSIVE |  | INCONCLUSIVE: public web-form session not issued: 404 |
| G-09 | g09LeadsMadeByWorkflow | PASS | PASS | leads:33f193de |  |
| G-10 | g10LeadsMadeByBlueprint | INCONCLUSIVE | INCONCLUSIVE | deals:2478bb35 | INCONCLUSIVE: blueprint After 'Create record' made no lead 'QA AEO SG G-10 made fj9l' (missing list item 9: not offered in the After list) |
| G-11 | g11DealsUiCreate | PASS | PASS | deals:05d0f130 |  |
| G-12 | g12DealsApiCreate | INCONCLUSIVE | INCONCLUSIVE | deals:7dfe04be | INCONCLUSIVE: no API channel: a records-API create has source 'manual', so the assignment stage cannot run; the rest ran in order |
| G-13 | g13DealsImport | FAIL | NOT A BUG | deals:a643f3dd | not reproducible: minimal import, import + review, and the original test (19 Oct, deal 054bcdcf) all assign the owner |
| G-14 | g14TasksUiCreate | PASS | PASS | tasks:176f6a3c |  |
| G-15 | g15TasksApiCreate | INCONCLUSIVE | INCONCLUSIVE | tasks:692e7dc0 | INCONCLUSIVE: no API channel: a records-API create has source 'manual', so the assignment stage cannot run; the rest ran in order |
| G-16 | g16TimelineShowsOrder | FAIL | CONFIRMED B-10 | leads:d31541d8 | no workflow / blueprint rows, assignment as System (lead 4115e483) |
| G-17 | g17TwoWorkflowsThenApproval | PASS | PASS | leads:5cc3917d |  |
| G-18 | g18ApiEmptyTrigger | INCONCLUSIVE | INCONCLUSIVE | leads:5985514c | INCONCLUSIVE: TAVI accepts but ignores an empty 'trigger' list (no documented trigger parameter): workflow=true approval=true blueprint=false (Zoho: [] skips al |
| H-01 | h01ConvertReleasedLeadDealProcesses | INCONCLUSIVE | INCONCLUSIVE | leads:658ef7f1 | INCONCLUSIVE: conversion created no Deal; it created: contacts=a0a46496-f6aa-43a3-ae2a-e70a462dc9b3 (created) subscriptions=3568b122-c891-4212-9f83-b9994e414de3 |
| H-02 | h02ConvertPendingReviewBlocked | FAIL | CONFIRMED B-02 | leads:22d5679b | convert 200 while held for review (lead da6f6b7c) |
| H-03 | h03ConvertPendingApprovalBlocked | FAIL | CONFIRMED B-01 | leads:ba3a146a | convert 200 while pending approval (lead fe605f05) |
| H-04 | h04ConvertLeadInBlueprint | FAIL | INCONCLUSIVE | leads:e3506ceb | convert of a governed lead 200 (lead bf10dce6); Zoho does not document it - needs a product decision |
| H-05 | h05ScheduledActionsDroppedOnConvert | FAIL | CONFIRMED B-13 (+B-12) | leads:ba12d70d | delayed webhook ran after conversion (lead 64684edc) |
| H-06 | h06WorkflowTaskRunsOwnChain | PASS | PASS | tasks:6e328a41 |  |
| H-07 | h07MassConvert | INCONCLUSIVE | INCONCLUSIVE |  | INCONCLUSIVE: no mass-convert endpoint answered 2xx (/records/mass-convert -> 405; /records/bulk-convert -> 405; /records/convert -> 405; /mass-convert -> 404;  |
| I-01 | i01EditWhileReviewPending | PASS | PASS | leads:f1eb9739 |  |
| I-02 | i02EditWhileApprovalPending | PASS | PASS | leads:b948080c |  |
| I-03 | i03ReleaseUnreviewedContinuesChain | PASS | PASS | leads:6595b1f5 |  |
| I-04 | i04DeactivateApprovalWhilePending | PASS | PASS | leads:88eaf596 |  |
| I-05 | i05DeactivateBlueprintWithRecord | PASS | PASS | leads:a35e480f |  |
| I-06 | i06DeleteWorkflowBetweenReviewAndWf | PASS | PASS | leads:75b6c101 |  |
| I-07 | i07ConcurrentSaveConflict | PASS | PASS | leads:57ee5f61 |  |
| I-08 | i08StatusResetOnApprovedRecordInBlueprint | PASS | PASS | leads:b214c3c1 |  |
| I-09 | i09DeleteHeldRecordThenRestore | INCONCLUSIVE | INCONCLUSIVE | leads:248a0f9e | INCONCLUSIVE: a record pending review cannot be deleted by userN, adminA or Owner (nameb56175@airhemp.com -> 422 {"success":false,"data":null,"error":{"code":"R |
| I-10 | i10OwnerAssignmentOnEditNoReviewReentry | PASS | PASS | leads:2ace2ee6 |  |
| J-01 | allFiveProcessesOnTasks | FAIL | TEST DEFECT |  | same as E-15; the other four processes switch on for Tasks |
| J-02 | reviewOnTasks | PASS | PASS | tasks:6335b7b7 |  |
| J-03 | approvalAssignTaskRunsTasksChain | PASS | PASS | tasks:c073c7b0 |  |
| J-04 | workqueueCompletionNotAffected | NOT RUN | NOT RUN |  | NOT RUN: needs Tasks status = Completed, which fires the teammate rule ActionsOnTaskCompletionFromWorkqueue |
| K-05 | k05TimelineNamesReviewerInOneRejectionNote | PASS | PASS | leads:15e67349 |  |
| K-07 | k07ReEvaluateOptionNotOffered | PASS | PASS | leads:70c7b6fb |  |
| K-08 | k08EveryDatatypeReviewableOrExplained | PASS | PASS |  |  |
| K-09 | k09ApprovalStatusFieldLockedInLayout | INCONCLUSIVE | INCONCLUSIVE |  | INCONCLUSIVE: approval_status not found in the layout JSON - cannot tell whether it is hidden from the builder or named differently (UI check) |
| K-09 | k09ApprovalStatusRefusedInApprovalCriteria | PASS | PASS |  |  |
| K-09 | k09OwnerCanEditApprovalStatus | FAIL | NOT A BUG | leads:030c754b | Approval Status is changed through the status-reset action (Owner reset works, D-18); hand edit 422 APPROVAL_STATUS_READ_ONLY by design |
| K-11 | k11DelegationTimelineNamesAndComment | PASS | PASS | leads:2b654065 |  |
| K-13 | k13A1NewRecordSeededNotSubmitted | PASS | PASS |  |  |
| K-13 | k13B1GuardInjectedIntoEntryCriteria | PASS | PASS |  |  |
| K-13 | k13B3ReentryOnlyAfterAuthorizedReset | PASS | PASS | leads:687f4631 |  |
| K-13 | k13D2ApprovalEventsOnTimeline | PASS | PASS | leads:e0511e29 |  |
| Z1 | z1ImportStartsApprovalAndBlueprint | PASS | PASS | deals:28577daf |  |
| Z2 | z2ImportManualApprovalHonoured | FAIL | GAP NDC-2294 #2 | leads:24ede995 | manual approval of imported records is 'Coming soon'; the API accepts manual_approval=true and ignores it |
| Z3 | z3ScoreAndNotesTriggers | FAIL | GAP NDC-2294 #3 |  |  |
| Z4 | z4MeetingCallFunctionConnectedRecordActions | FAIL | GAP NDC-2294 #4 |  |  |
| Z5 | z5OwnerAssignmentByAssignmentRule | FAIL | GAP NDC-2294 #5 |  |  |
| Z6 | z6ReviewFunctionHooks | FAIL | GAP NDC-2294 #6 |  |  |
| Z7 | z7ApproverAnyoneEveryone | FAIL | GAP NDC-2294 #7 | d23fb4e0-248d-41f6-af60-d28885a7007e |  |
| Z8 | z8ApprovalCallFunctionRuns | FAIL | GAP NDC-2294 #8 |  |  |
| Z9 | z9BlueprintAfterActions | FAIL | GAP NDC-2294 #9 |  |  |
