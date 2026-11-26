# NDC-2871 Desk Approvals page — retest run (24 Nov 2026)

Also in this session: NDC-3186 retest PASS (wf-regression folder, cases/rt24.js, rt24c.js; cleanup24 verified zero).

## How to run
- `node scripts/multi.js out/<file>.js` — API script; `as(label)` accounts, one sign-in each (token store in tmp). lib.js has helpers + state (out/state.json).
- `node scripts/ui.js "<label>" out/<file>.js` — Playwright Edge, saved session in automation/.auth.
- Results: out/results.jsonl (last line per id wins). Ledger of everything created: ledger.md.

## Accounts (no profile changes)
O owner · A Test User 1 (Desk Supervisor, requester) · B Customer Experience Specialists 2 (Desk Agent, approver) · D QA Team 1 (Desk Administrator, team member) · S Mahmoud TAVIPortal (Desk Supervisor, Dept 2 only).

## Build map
- Page /approvals; lists waiting / requested / decided / all_pending; nav count GET /desk/approvals/count.
- GET /desk/approvals?list&department_id&source&q&sort(requested_at|ticket_number|department, -prefix)&page&page_size&waiting(4h|1d|3d|overdue) -> approvals, counts, permissions.
- GET /desk/approvals/{id}; ticket approvals /desk/tickets/{t}/approvals (+/approve|reject|cancel|remind|reassign|comments|activity|eligible-approvers). Request body approver_user_ids, approver_team_ids. On behalf: on_behalf_reason, on_behalf_of_user_id. Reassign {from:{user_id|team_id}, to:{...}}.
- Web form: /web-forms/{form}/pending/{id}/{approve|reject|spam}; approve {department_id, priority}; reject {reason, notify_submitter}; spam {block_sender}. Form PUT needs If-Match row_version + layout_id. review {mode, spam_threshold, approver_ids, approver_team_ids, decide_within_hours}.
- Blueprint step: during.deskItems {kind:'approval', approverUserIds, approverTeamIds}; run body needs approval {subject, approver_user_ids}.
- Settings: /desk/settings/approvals {default_limit_hours, escalation_enabled}; page /settings/tickets/approvals. Permissions desk:approvals:manage, desk:approvals:view_department.

## Changed shared settings (restore!)
- /desk/settings/approvals default_limit_hours 24 -> 1 (for K rows). RESTORE to 24.
- QA PA Form decide_within_hours 1 (form is deleted in cleanup).

## Findings so far
- BUG H1/H3/H4: blueprint approval step - transition and after-actions complete at once; approve does nothing; reject leaves ticket in target state; re-run impossible.
- BUG E3: reject without reason accepted (API; single reject dialog says "Comment (optional)"; bulk reject requires 3+).
- E17: requester can cancel blueprint approvals (API 200, UI shows Cancel request).
- HX: blueprint run can name any approver (step approver not enforced).
- G7: web form reject reason 1-1000 (requirement 3-2000).
- Gaps: C2 filters (requester, approver, date, blueprint, form, priority), B10 requester sort, L4 reports, D10 keyboard next/prev, D3/D4/D5 detail fields, B5 row fields, B3 decided order.
- Not run (safety check): A13 (profile permission), A11 by agent removal (covered by ticket move instead).

## Done 24 Nov
- K1/K3/K4/K5 PASS. Cleanup: 30 approvals cancelled, 9 submissions rejected, 44 tickets, blueprint, form, team, WF rule deleted, bin purged 48, settings restored to 24 h, protected Tech items still pending. QA PA Dept 2 deleted (transfer to Tech, memberships unchanged). QA PA Dept 1 LEFT (empty; delete needs a transfer department and no department holds all 4 agents) - ask user.
- Report artifact https://claude.ai/artifact/JmMKZ7tqBk5yy3RJhsYmr8 (scripts/make-report.js + findings.json). Nothing posted to Plane.

## 25 Nov — not-run cases + issues report
- A13 PASS (Desk Supervisor view_department removed -> 403, restored with effect GRANT; note: POST effect must be GRANT/DENY).
- N4 PASS, N5 PASS, K7 PASS (UI translates bell), E2E-4 PARTIAL (focus issues). B locale changed and restored to baseline (en, DD/MM/YYYY, 24h, tz null) via PUT /settings/value; header switched back to EN.
- Final: 99 pass, 17 partial, 9 fail, 13 inconclusive, 2 not in release, 0 not run.
- Issues-only report https://claude.ai/artifact/HpY4s7ys2p9wyMmaNhCmvk (node scripts/make-report.js --issues); full report v2.
- Cleanup of N items verified zero. QA PA Dept 1 still left (empty), waiting for user.

## 25 Nov — Plane
- NDC-3186 -> Done, comment + evidence/annotated/NDC-3186-retest-pass.png (rebuilt scenario, Execution History).
- Hierarchy check (out/hier.js): page/API hide others' approvals from plain agents (404/403); supervisor sees + remind/reassign only; admin on behalf ok; owner cannot decide own request. Gap: ticket Approval tab shows all approvals -> NDC-3304.
- Filed NDC-3287..3300, 3302..3304 (17, Bug, Sprint 17, Desk, trio, labels, annotated images, relates to NDC-2871). bugs.js + scripts/file-bugs.js + out/filed.json. NDC-3301 = accidental duplicate of 3302 (network retry), Cancelled + duplicate link (delete was blocked).
- Arabic date "finding" dropped: Arabic-digit date reads correctly right-to-left (N4 PASS).
- Not filed (test coverage only): B15, L3, K6, E2E-1, N11, H9 (part of 3287); inconclusive rows.
- NDC-2871 state unchanged (Ready For Test). Cleanup zero; QA PA Dept 1 still left.
- 25 Nov later: renamed 13 bug titles "Approvals |" -> "Approvals Page |" (3287/3290 Blueprint, 3302 Notifications kept). All 17 relate to NDC-2871 (verified). NDC-2871 -> Done with pass/fail comment + 13 annotated images (P1-P5 pass, 01,01b,02,03,04,06,10,18 fail).
