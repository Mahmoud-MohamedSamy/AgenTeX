# Lane AS (Assignment + Skills) — round 19, 16 Nov 2026
Prefix: QA RT19 AS. Helpers: scripts/as/.
## Status
- started: reading tickets, setting up helpers
- 2839 DONE PASS (image NDC-2839-retest-PASS.png)
- 2824/2970 thresholds run (t2824/t2): PASS on thresholds; load-based count inconsistent (tload*), still analysing
- 2931/2932/2933(API)/2971(API) run in t2: all as expected; UI parts in progress
- 2838 DONE PASS
- 3046 DONE PASS
## handover to SK lane (16 Nov, AS lane resumed run)
Lead split: SK lane now owns NDC-2931, 2932, 2933, 2971. AS lane API results (scripts/as/out/t2.log, created in QA AS6 Dept A, skills QA RT19 AS S1/S2/S3/Inact, rules now all inactive):
- 2931: RR skill rule pool A1+A3; ticket S3 (nobody)+S1 (A3) -> A3 (#4210); S3 only -> unassigned (#4211); S1+S2 held by different agents -> alternates A1/A3/A1 (#4212-4214). Assign by Skills S3+S1 -> A3 (#4215); S3 only -> assigned:false nobody_eligible message; no skills -> no_skills. API as expected (any-skill match).
- 2932: no-skills ticket with skill rule -> stays unassigned (#4219, #4220), feed shows no assignment; adding S1 by edit -> A3. API as expected. Not done: backlog-path check (GET backlog 404).
- 2933: create in Dept A with S1 + inactive skill + other dept (QA SK13 S1) + QA AS6 sk1 -> kept only S1 + QA AS6 sk1 (#4222); edit to S2+Inact+QA SK13 S2 -> kept only S2. API as expected. UI (field options) NOT done.
- 2971: ticket with skill "QA RT19 AS Del" -> skill deleted (204) -> existing ticket now shows only S1 (deleted skill dropped); create with deleted skill -> 422 MULTI_SELECT_VALUE_INVALID. API as expected. UI (Workflow Add/Remove skills list, Create Ticket Skills options, ticket view) NOT done.
- UI started only: one screenshot 2931-1-setup-skills-help.png (Setup skills page). No verdicts written.
AS lane will not touch these further.
## Resumed run (16 Nov, after lead split: AS owns 2824, 2970, 2275)
- Found 13 QA AO Dept B rules still ACTIVE (earlier PUT /active without version -> 400). Fixed lib getRule (AOB) and set all inactive (200).
- 2824/2970 "inconsistent load count" explained: rule counts phantom tickets. Test User 1 +2 in AO-B (all day, t3/t6/tcount), Dev Team 2 +1 since t4 T-b (ghost record "QA RT19 AS R19AS4seunc b1thr3" 4e6a4894, no ticket number, no activity, 11:25Z). Auto-assigned+deleted ticket alone did NOT add (t5 W). Clean probes t3/t4/t6 -> 2824 PASS, 2970 PASS (+ new defect).
- 2275: NF-3 (prev run nf3b 5/5 PASS), GEN-13 import (uimp + impchk), help text EN/AR (uimp, uimpar2), RR on create #4553, history -> PARTIAL.
- Final check: 32 QA RT19 AS rules, 0 active; prefs AS6 A/B, AO-B identical; notif settings identical; direct switch OFF (not touched).
- DONE.
