# Ebhar Misr — Candidate Flow in TAVI CRM: Test Report

| | |
|---|---|
| Client | Education First — "Ebhar Misr" (إبهار مصر) competition |
| Date | 20 Oct 2026 |
| CRM | https://crm.taviportal.com — org of `moaazdly89+edufirst@gmail.com` (Owner) |
| Website | https://competition.102-206-132-183.sslip.io/#apply |
| Requirements | `Ebhar_Misr workflow.pdf` (journey, statuses, roles, N01–N07) and `الفورم.pdf` (17 registration fields) |
| Module | Competition Applications (`competition_applications`) |
| Tested by | QA (API + browser), 3 test records EM-00040 … EM-00042, deleted after the run |

## Current status — 21 Oct 2026, end of day

**Setup:**
- The flow runs on the blueprint "إبهار مصر — مراحل الطلب" (`cda430d9…`); the approval stages are deleted.
- Registration buttons are for the record owner only. Video buttons go by category assessor profile, and each category's owner rule assigns round robin. Committee buttons go by profile.
- Score and comments are read-only after approval. Assessors can't see applicants' personal data, except national ID, email and phone (required fields, read-only).

**Tested and passing:**
- Full journey with real user logins (34/34)
- Role checks (62/62)
- Arts round robin 3 / 3 / 3 (records EM-00083 … EM-00091 kept for review)
- Privacy checks (14/14)

**Open for developers — section 7:**
- **B-EM1:** workflow rules don't run after "اعتماد الفيديو", so the Committee hand-over never happens.
- **B-EM2:** the N04 status update is sometimes lost when several videos are saved at the same moment.

Other open points:
- The student portal has not been tested with a real student login (EM-00068).
- `age` is empty on web-form records.
- Only 2 Registration Admins and 1 Committee user.
- Client decisions in section 6.

The sections below keep the full history from 20 Oct onwards.

## Update 25 Oct 2026 — retests + full E2E from the real website

**Retests (moved to Done in Plane with the user's OK):**
- **NDC-2420 — PASS.** EM-00125 in the UI and EM-00124: after «اعتماد الفيديو» the owner moves to the Committee user, and the hand-over rule is logged as Fired. N02 still works.
- **NDC-2421 — PASS, 27/27.** Two batches of 9 parallel link saves, plus 9 parallel creates against a brand-new round-robin counter (temporary QA rule, deleted after).
- Evidence: `evidence/NDC-2420-retest-2026-10-25.png`, `evidence/NDC-2421-retest-2026-10-25.png`.

**Full E2E with the real website form** (https://educationfirst.anyware.software/en/ebhar-misr#register):
- **Form:** a CRM embedded web form behind Cloudflare Turnstile. Automated browsers always fail the check, even with a human tick, so the user submitted the 5 applications by hand.
- **Records:** EM-00153 W1 Science, EM-00154 W2 Math, EM-00155 W3 Technology, EM-00156 W4 Arts, EM-00157 W5 Arts (rejected). All have source `web_form`, status Pending Verification and the ID photo saved, and the round robin alternated reviewer2 / reviewer1.

| Step | Result |
|---|---|
| Registration review by the owner reviewer (other reviewer sees no buttons; reject needs a reason) | ✅ 21/21 |
| N02 portal access granted (W1–W4), none for W5 | ✅ |
| **Student portal (M3)**: W2/W3/W4 students received the access email at @anyware.software, logged in (13:31–13:39 UTC), changed password and saved their video link → N04 + category owner round robin + «إسناد التقييم» ran | ✅ **M3 closed** |
| W1 video saved in the CRM (portal email to Gmail could not be delivered) | ✅ |
| Assessors (pool-science, pool-math, pool-technology, reviewer3 for Arts): other category sees no buttons; W2 send-back → resubmit → approve; score locked after approval | ✅ |
| Hand-over to Committee after each approval (NDC-2420 fix), 4/4 | ✅ |
| Committee: W1, W2, W4 Finalist Accepted; W3 Finalist Rejected; no buttons left in any end state | ✅ |

Totals: 21/21 (review), 25/30 + 7/7 (assessment and Committee). The 5 failures in the first assessment run were a test-side login failure for reviewer3; they passed on the re-run.

**New findings:**
- **Email to external addresses fails.** The CRM's Zoho SMTP account (`no-reply-reset@anyware.software`) delivers to @anyware.software but fails for Gmail (`MAIL_SEND_FAILED` / HTTP 422), every time. That's the root cause of all the "emails failing" results. Real applicants (Gmail, Yahoo…) will receive no N01–N07 emails and **no portal password** until external sending is enabled on that Zoho account, or the CRM uses a proper transactional sender. **Blocker for go-live.**
- **Birth date:** all 5 web records have birth date 2008-12-12. The user confirmed they entered that date, so it's not a defect. `age` is still empty.
- **Email blocker is on hold** at the user's request (25 Oct).

**Go-live readiness (25 Oct):** the flow is ready end to end (website form, review, portal, assessment, Committee, permissions; both bugs fixed). Go-live waits on the external-email blocker (on hold), plus setup and client items: real staff in the profiles, the age range and age mapping, and the M6/M7/M11/M12 decisions.
- My test script overwrote the W2–W4 video links that the students had saved in the portal with QA links. The flow is unaffected, but the records show the QA links.


## 1. Summary

The candidate journey runs end to end in the CRM: **16 of 16 status, owner and approval checks passed**.
Two things block the client demo:

1. **No email is delivered.** Since 15:28 UTC every email fails with HTTP 422. The cause is the outgoing mailbox, not the CRM rules (details in M1).
2. **The registration web form does not exist.** The website shows "تعذّر تحميل نموذج التسجيل"; this is being built (M2).

Sections 2–3 cover what runs, section 4 covers what is missing, and section 5 gives the suggested order of work.

## Update 21 Oct 2026 — the flow now runs on the blueprint

The team built the blueprint "إبهار مصر — مراحل الطلب" to replace approval Stages 1–3. Running both doubled every decision, so the flow was moved fully onto the blueprint (with the user's approval).
Sections 2–3 below describe the 20 Oct approval-based setup; for decisions, read "approval stage" as "blueprint button" from now on.

| # | Change on 21 Oct |
|---|---|
| D1 | Blueprint **cloned** as "إبهار مصر — مراحل الطلب — نسخة أصلية 21-10" (`9fe778e7…`, **inactive**). It is identical to the original (17 transitions), so it can be restored at any time |
| D2 | Approval Stages 1, 2 and 3 **switched off** (undoes C6) |
| D3 | Rule "دخول البوابة عند قبول التسجيل (N02)" **switched back on** (undoes C7); the blueprint can't send portal access itself |
| D4 | Blueprint buttons "قبول التسجيل" and "رفض التسجيل": **record owner only** ("Allow record owner" on, Registration Admin profile removed). The Owner account stays as a backup. Published as a new blueprint version |

Test run through the blueprint: 4 records EM-00043 … EM-00046, deleted afterwards. **All checks passed**; mail is still blocked (M1). (The first run showed 5 false failures from a test-script bug that read every transition in the blueprint instead of only the buttons offered. B02, B21, B22 and B25 were re-checked with the fix and pass. B09 is covered by B10, where the server itself refuses the wrong-category button.)

| ID | Check | Result |
|---|---|---|
| B01 | New record → `Pending Verification`, ref EM-000xx | ✅ |
| B02 | At Pending only "قبول التسجيل" / "رفض التسجيل" are offered | ✅ |
| B03 | No approval request starts (stages off) | ✅ |
| B04 | A video button can't be used at Pending ("No matching transition") | ✅ |
| B05 / B06 | Approve → `Registration Approved`; N02 rule creates portal access | ✅ |
| B07 / B08 | Video link → `Video Submitted` → `Assessment Assigned`; owner → Pool Science | ✅ |
| B09 / B10 | The Math button is refused on a Science record ("not allowed for this user or visibility rules") | ✅ |
| B11 / B12 | Send back without a note is refused; with a note → `Action Required` (N05) | ✅ |
| B13 / B14 | Portal access kept at Action Required; new link → `Assessment Assigned` | ✅ |
| B15 / B16 | Approve video: no score refused, 120 refused ("الدرجة من 0 إلى 100"), 85 → `Assessment Complete`, score + comments saved | ✅ / ✅ / ✅ |
| B18 | Committee "accept" → `Finalist Accepted` (N06) | ✅ |
| B19 / B20 | Reject without a reason is refused; with a reason → `Registration Rejected` (N03) | ✅ |
| B21 / B22 | After rejection: no buttons left (end state), no portal access | ✅ |
| B23 / B24 / B25 | Technology record: owner → Pool Technology, score 55, committee "not selected" → `Finalist Rejected` (N07), no buttons left | ✅ |
| B26 | Status can't be edited directly (`BLUEPRINT_GOVERNED_FIELD`); only buttons and workflow rules change it | ✅ |

Notes:
- **Workflow rules still move the status** (N04 → Video Submitted, إسناد التقييم → Assessment Assigned) under the blueprint, through the automatic transitions that only the Owner account can use. Keep those transitions as they are.
- "Record owner only" was tested as the Owner account (also a backup approver). A login as a second Registration Admin is still needed to prove that a non-owner can't see the buttons (M8).
- Emails: N01/N04 and the N02 access email failed with HTTP 422 (M1). The emails typed into the blueprint buttons (N03/N05/N06/N07) do not appear in the workflow execution log, so they can only be verified once mail works.
- `Finalist Accepted` has no buttons after it, as designed, but it isn't marked as an end state. That's harmless.

### Re-test 21 Oct, 11:17 UTC — on "إبهار مصر — مراحل الطلب (copy)"

The team made the (copy) (`cda430d9…`) the active blueprint at 10:38 and switched "إبهار مصر — مراحل الطلب" off. The (copy) has registration buttons for the record owner only, all 8 video buttons for that category's assessor profile (Mathematics / Science / Technology / Arts), committee buttons for the Committee profile, and Finalist Accepted as an end state. Same checks B01–B26, plus B00 (a new record enters the (copy)): **27 of 27 passed**, on records EM-00048 … EM-00051, which were deleted afterwards. No one changed the setup during the run.
- Records created before the switch moved to the (copy). For example, EM-00047 (created 10:28) now sits at Pending Verification in the (copy) with both registration buttons.
- Email: every attempt still fails with HTTP 422 (N01, N04, and N02 for one of the two records). N04 is sent once per video link saved, with no duplicates.

Evidence: `evidence/run-e2e5.log`, `evidence/e2e5-results.json`, `evidence/blueprint-copy-cda430d9-tested.json`.

### Role test 21 Oct — logged in as each of the 9 users

Setup as the Owner, then each user logged in with their own account:
- **RA** EM-00052: Science, Pending, owned by reviewer1
- **RB** EM-00053: Science, Assessment Assigned, owned by pool-science
- **RC** EM-00054: Math, Assessment Assigned, owned by pool-math
- **RD** EM-00055: Science, Assessment Complete

**62 of 62 checks passed.** That covers login, which records can be opened, which buttons show, forbidden buttons refused, and allowed buttons working. The 4 records were deleted afterwards.

| User (profile) | Can open | Buttons | Refused (tested) | Did successfully |
|---|---|---|---|---|
| reviewer1 (Registration Admin) | RA only (own record) | RA: قبول / رفض التسجيل | video approve on RB, finalist on RD | approved RA → Registration Approved |
| reviewer2–4 (Registration Admin) | none of the test records | none | reviewer2: approve / reject RA (owned by reviewer1) | — |
| pool-science (Assessor Science) | RB, RD (own records) | RB: Science approve / send back. RD: none | approve on RA, Math approve on RC, finalist on RD | approved RB with score 80 → Assessment Complete |
| pool-math (Assessor Math) | RC only | RC: Math approve / send back | Science approve / send back on RB | sent RC back → Action Required |
| pool-technology, pool-arts | none | none | Science approve on RB, Math send back on RC | — |
| pool-registration (Committee) | **all records** (18) | RD only: finalist / not selected | approve on RA, video approve on RB | finalist on RD → Finalist Accepted |

Findings:
- **R1 — An assessor can change the score after approving (Medium).** pool-science still owns RD after the video approval and could edit `assessment_score` directly (70 → 99, HTTP 200). The Committee user could too. **Fix:** make `assessment_score` / `assessment_comments` read-only for the assessor and Committee profiles (field permissions), or move the owner to the Committee once the video is approved.
- **R2 — EM-00036 (old test record, owned by reviewer1, Arts) is visible to all 9 users (Low).** Every other record follows ownership. It may be shared by hand. Check the record's sharing, or delete it (it's a leftover test record).
- **R3 — The Committee sees every record, including Pending ones (Info).** That's fine for an Assessment Lead; restrict it if the client wants the committee to see finalists only.
- **R4 — Settings visible to everyone (Low).** Every profile can read the approval-process list and the user list. Registration Admins can also read profiles and portal settings. Everyone is refused workflow rules, blueprints and the mail connection. Consider turning off "view settings" for these profiles.
- Logins: all 9 users signed in with the shared password. Assessors and the Committee land on another module (`8c6e2e72…`) instead of Competition Applications; set their home page if needed.

Evidence: `evidence/run-rbac.log`, `evidence/rbac-results.json`.

### Fix R1 + final E2E — 21 Oct, 13:25 UTC

**Change D5:** `assessment_score` and `assessment_comments` set to **read-only** for the 4 category assessor profiles (Mathematics, Science, Technology, Arts). They were already read-only for Committee, Registration Admin and the old general assessor profile. The blueprint "approve video" button still saves the score; only direct edits are blocked.

Final scenario: 5 applications, every decision made by the real user of that role. The Owner only simulated the web form (create + assignment to a reviewer) and the student's portal step (saving the video link). **34 of 34 checks passed.** Records EM-00060 … EM-00064 were deleted afterwards.

| # | Path | Users | End |
|---|---|---|---|
| F1 | Science: approve → video → send back → resubmit → approve 88 → finalist | reviewer1, pool-science, Committee | Finalist Accepted |
| F2 | Arts: reject (refused without a reason, then with one) | reviewer2 | Registration Rejected |
| F3 | Technology: approve → video → approve 61 → not selected | reviewer3, pool-technology, Committee | Finalist Rejected |
| F4 | Math: approve → video → approve 92 → finalist (pool-science sees no buttons) | reviewer4, pool-math, Committee | Finalist Accepted |
| F5 | Arts: approve → video → approve 79 → finalist | reviewer4, pool-arts, Committee | Finalist Accepted |

- reviewer2 saw no buttons on reviewer1's application. Each assessor saw only their own category's buttons.
- Score lock: pool-science (50) and the Committee (40) got `FIELD_PERMISSION_DENIED … read-only for your profile`, and reviewer1 got `PERMISSION_DENIED`. The score stayed 88.
- **Email now works (M1 resolved):** N01 and N04 show "Succeeded" (HTTP 200) for every record, and N02 portal access was "sent" for F1.
  - For F3–F5, N02 was cancelled because the test saved the video link within seconds of approval, before the access job ran (about 10 s later), so the status no longer met the portal condition. A real student can only save the link after getting access, so this is a test artifact, not a defect.
  - The blueprint button emails (N03/N05/N06/N07) aren't in the execution log. Check the `moaazdly89+qafinal31…35@gmail.com` inboxes to confirm them.

### Committee hand-over and Arts round robin — 21 Oct, 15:00–15:40 UTC

**D6 — new rule "إبهار مصر — نقل الملكية للجنة بعد اعتماد الفيديو"** (on edit, status changes to Assessment Complete → owner round robin over the Committee profile). It is on, but **it doesn't fire**:
- In 3 runs (C1 Science, C2 Math, and a probe as the Owner), the owner stayed with the assessor after "اعتماد الفيديو".
- The execution log has no run of the rule at those moments.
- With the "status changed" condition removed and a later harmless edit, it fired and moved the owner to the Committee user. So round robin by profile works; the trigger is what's missing.

**Bug B-EM1 — workflow rules don't run after a blueprint button that saves fields.**
- **"قبول التسجيل" (no fields):** N02 runs right after it, as expected.
- **"اعتماد الفيديو" (score + comments):** no rule runs.

Workaround until it's fixed: none in the rules (a blueprint button can't set the owner by round robin). The Committee can still act, because its buttons go by profile.

**Team change (checked):** the 4 category owner rules now assign round robin over their category profile. The Arts profile has 3 users: pool-arts, reviewer3, reviewer4.

**Arts test:** 9 Arts applications were created at once through the API (there is still no web form) and approved, then the 9 video links were saved at the same moment.
- **Round robin: ✅ 3 / 3 / 3** (pool-arts, reviewer3, reviewer4) once all 9 reached Assessment Assigned.
- **Bug B-EM2 — 5 of the 9 lost the N04 status update.** The N04 rule shows "Fired" and its email went out, but its field update (Video Submitted + `video_submitted_at`) was silently dropped, with no error. Because the status never changed, the category owner rule never ran. Re-saving those 5 links one at a time worked straight away. So this happens only when several videos are saved in the same second. Impact: a student's application could stay at "Registration Approved" with a link saved, and nobody would get it.
- 2 of the 9 N04 emails failed with HTTP 422 (mail delivery is intermittent again).

The 9 records (EM-00074 … EM-00082) and the C1/C2/probe records were deleted. Note: reviewer3 and reviewer4 moved from Registration Admin to Arts, so only 2 Registration Admins are left for the round-robin registration review.

**Clean-up (user confirmed, 21 Oct ~15:45 UTC):**
- **Deleted:** 13 old test records (EM-00027 … EM-00039), approval Stages 1–3, and the rules "Reject under-18 applicants", "Send portal access when approved" and "مالك الطلبات بدون فئة".
- **Already gone:** the 3 inactive blueprints (the delete returned 404; only the active blueprint remains).
- **Backups:** all 22 items are in `evidence/backup-cleanup-2026-10-21/`.

**Arts re-test, records kept for the user (EM-00083 … EM-00091, "QA ARTS9 R2-1…9"):** 9 Arts applications were created and approved together, then the 9 links were saved at once.
- **All 9 reached Assessment Assigned this time, split 3 / 3 / 3** (pool-arts: EM-00085, 86, 90; reviewer3: EM-00084, 87, 91; reviewer4: EM-00083, 88, 89). Each has portal access.
- Bug B-EM2 did not happen this time, so it's **intermittent**.
- **Mail:** N01 failed (HTTP 422) for all 9, and N04 is failed or pending. Delivery is broken again.

**Web-form records (user's tests EM-00057 … EM-00073):**
- Created with source `web_form`, N01 fired, and round robin alternated reviewer1 / reviewer2.
- Issues:
  - `age` is empty on every one.
  - Test addresses `name1…6@example.com` bounce, which hurts the sender's reputation and is the likely cause of the repeated HTTP 422 blocks.
  - EM-00068 is at Assessment Assigned with owner reviewer1, and N04 never ran for it (no `video_submitted_at`). If its link was saved from the portal, portal saves don't trigger rules.
  - No CRM web form exists in `/web-forms`.

**D7 — Assessor privacy (M4), 21 Oct ~19:15 UTC.** The 4 category assessor profiles now have the same field rules as the old general assessor profile:
- **Hidden (10 fields):** birth date, age, landline, address, father/mother phone and email, emergency phone, ID document.
- **Read-only (19 fields):** name, school, category, video link, score and the rest.
- **Not hideable:** national ID, email and phone are **required fields**, and the CRM refuses to hide a required field from a profile (`FIELD_REQUIRED_HIDDEN_CONFLICT`). They are read-only for assessors instead, so assessors still see them. To hide them, make those 3 fields not required in the CRM and keep them required on the website form.
- **Verified with real logins, 14/14:** pool-arts on EM-00085 and pool-science on a new Science record (EM-00092, deleted). The hidden fields aren't returned. Edits to email, national ID and name are refused. Send back, resubmit, approve with score and the Committee finalist all still work.

Evidence: `evidence/run-privacy.log`, `evidence/privacy-results.json`, `evidence/fieldperms-before-privacy.json` (rules before the change).

Evidence: `evidence/run-committee.log`, `evidence/run-rrprobe.log`, `evidence/run-arts9.log`, `evidence/run-arts9b.log`, `evidence/run-arts9c.log`.

Evidence: `evidence/run-final.log`, `evidence/final-results.json`, `evidence/run-pafail.log`, `evidence/run-fpapply.log`, `evidence/fieldperms-before.json`.

Evidence (first run): `evidence/run-apply5.log`, `evidence/run-e2e4.log`, `evidence/run-e2e4b.log`, `evidence/e2e4-results.json`, `evidence/e2e4b-results.json`, `evidence/pre-apply5-blueprint.json` (blueprint before D4), `evidence/e2e4-bpstate-sample.json`.

## 2. The flow as configured now

```
Web form ──► Record created, status = Pending Verification ──► N01 email
   │            (assignment rule: round robin to a Registration Admin = owner)
   ▼
Stage 1 approval (approver = record owner)
   ├─ Reject  ──► Registration Rejected + reason + N03
   └─ Approve ──► Registration Approved + portal access email (N02)
                     │
Student saves video link in the portal
   ▼
N04 rule ──► Video Submitted (+ time stamp) + N04 email
   ├─ category owner rule ──► owner = category user (Math / Science / Technology / Arts)
   └─ "إسناد التقييم" rule ──► Assessment Assigned
   ▼
Stage 2 approval (category assessors) — score 0–100 required to approve
   ├─ Send back ──► Action Required + correction note + N05 ──► student fixes link ──► N04 again
   └─ Approve   ──► Assessment Complete
   ▼
Stage 3 approval (Assessment Lead / Committee profile)
   ├─ Approve ──► Finalist Accepted + N06   (N08 when finals date + location are filled)
   └─ Reject  ──► Finalist Rejected + N07
```

### Changes applied on 20 Oct 2026 (with the user's approval)

| # | Change |
|---|---|
| C1 | Stage 1: one rule, condition `Status = Pending Verification`, approver **Record Owner** (was 4 per-category rules with an invalid approver group) |
| C2 | Portal access: `Registration Approved`, `Profile Accessed`, **`Action Required`** (was only Registration Approved, so the student could not fix a link) |
| C3 | Review process "Eligibility Reviewers" switched off (it duplicated Stage 1); its one held record was released unchanged |
| C4 | New workflow rule **N01** (on create → N01 template to the record email) |
| C5 | 4 category-owner rules: now on edit, only when status changes to `Video Submitted` (before, they would have taken the record at creation); switched on |
| C6 | Stages 1–3 switched back on (they had been switched off by another edit at 15:24) |
| C7 | Duplicate rule "دخول البوابة عند قبول التسجيل (N02)" switched off (Stage 1 already sends portal access) |

Earlier the same day the team fixed the status values used by the rules (`Action Required`, `Finalist Rejected`, `Pending Verification`) and added the Stage 2 score fields.
Backup of the configuration before the changes is kept in the QA scratchpad (`backup-2026-10-20`).

## 3. What runs: test results

| ID | Check | Result |
|---|---|---|
| T01 | New record gets `Pending Verification` and a reference number (EM-000xx) | ✅ PASS |
| T02 | Stage 1 starts on create; approver = the record owner | ✅ PASS |
| T03 | Owner approves → `Registration Approved` (portal access action runs) | ✅ PASS |
| T13 | Owner rejects → `Registration Rejected`, rejection reason = approver comment | ✅ PASS |
| T04 | Video link saved → `Video Submitted` (time stamp filled) → `Assessment Assigned` | ✅ PASS |
| T05 / T14 | Owner moves to the category user (checked Science and Technology) | ✅ PASS |
| T06 | Stage 2 starts for the category assessor | ✅ PASS |
| T07 | Assessor sends back → `Action Required`, correction note saved | ✅ PASS |
| T08 / T09 | New link → back to `Assessment Assigned`, Stage 2 starts again | ✅ PASS |
| T10 | Approve without a score is refused; with score 85 → `Assessment Complete`, score + comments saved | ✅ PASS |
| T16 | Stage 2 approve through the API with the score | ✅ PASS |
| T11 | Stage 3 starts for the Committee profile | ✅ PASS |
| T12 | Committee approves → `Finalist Accepted` | ✅ PASS |
| T15 | Committee rejects → `Finalist Rejected` | ✅ PASS |
| — | Workflow rules fired in the right order (execution log) | ✅ PASS |
| — | Emails N01 / N04 delivered | ❌ FAIL — see M1 |

Notes on how it was tested:
- Records were created through the API as the Owner, simulating the web form. The website form itself could not be used (M2).
- The Owner account approved Stages 2 and 3 with **Takeover** (process admin), because the assessor and committee users' passwords were not available. A real login per role is still needed (M8).

Evidence: `evidence/run-e2e.log`, `evidence/run-e2e3.log`, `evidence/e2e-results.json`, `evidence/e2e3-results.json`, `evidence/stage2-approve-dialog-score.png`, `evidence/email-dispatches-2026-10-20.json`.

## 4. What is still missing and how to fix it

Severity: **Blocker** = the demo cannot run · **High** = a PDF requirement is not met · **Medium** = a gap or risk · **Low** = clean-up.

### M1 — Emails are not delivered · Blocker
- **What happens:** every workflow email since 15:28:21 UTC is `Cancelled — 1/1 recipient send(s) failed (last: HTTP 422)`. This hit all records, including another tester's record, so the test addresses and the rule changes are not the cause. The last successful send was at 15:27:50.
- **Cause (likely):** the CRM sends through Zoho Mail SMTP as `no-reply-reset@anyware.software` (`smtp.zoho.com:587`). That account shows **161 sent and 28 bounced in 7 days** (17%). Zoho blocks outgoing mail for accounts with that bounce rate or unusual volume.
- **Not verified:** approval-stage emails (N02 portal access, N03, N05, N06, N07) use the same account, so they are expected to fail too.
- **Fix:**
  1. Sign in to Zoho Mail (admin) for `no-reply-reset@anyware.software`, check "outgoing blocked" or the sending limit, and request the unblock.
  2. Stop the bounces: use real or plus-addressed test emails only, never invented domains.
  3. For the live competition, use a dedicated sender on the Education First domain (SPF/DKIM set) or a transactional provider. The connection type `transactional` already exists in Settings → Mail.
  4. Re-run T01–T15 and confirm each of N01–N07 arrives.

### M2 — Registration web form missing · Blocker (in progress, step 1)
- **What happens:** the site config points to form key `fw1.b542…`, and the CRM answers `404 WEB_FORM_NOT_FOUND`. Web Forms in the CRM is empty.
- **Fix:**
  1. Create the form on Competition Applications with the 17 fields from `الفورم.pdf` plus **Category (required)**.
  2. Add a **hidden field** `Application Status = Pending Verification`. The status field has no default value setting, so this hidden field is the only way to start Stage 1.
  3. Allow the website domain, publish, and put the new key in `main.js` (`EF_CONFIG.formKey`).
  4. Keep the assignment rule's channel = Web Form, so form records go round robin to the Registration Admins.

### M3 — Portal not tested end to end · High
- **What happens:** the student's sign-in and saving the link from the portal were not tested. The link was saved directly on the record, and the portal access email cannot arrive (M1).
- **Fix:** after M1, sign in as a test student, save a link, and confirm that a portal save triggers the N04 rule like an internal edit does.

### M4 — Assessors may see more than they should · High
- **PDF requirement:** an assessor sees only assigned submissions, with minimum personal data, and cannot change eligibility.
- **Not verified:** the record visibility and field permissions of the "Ebhar — Category Assessor" profile.
- **Fix:**
  1. Set record access for that profile to owned records only.
  2. Hide National ID, address, birth date, parents' phones and emails, emergency number and the ID document from it.
  3. Make Status read-only for it.
  4. Do the same review for "Registration Admin": no access to assessment scores.
  5. Test by logging in as each role.

### M5 — One assessor user per category; committee has one "pool" user · High
- **What happens:**
  - Owner rules assign a single fixed "Pool — <category>" user.
  - Stage 3's only possible approver is "Pool — التسجيل" (Committee profile).
  - The PDF asks for assessor(s) per category, plus committee moderation.
- **Fix:**
  1. Add the real assessors to each category org unit with the Category Assessor profile.
  2. Replace the owner rules with round robin inside the org unit, or keep the pool user and let Stage 2 (group approver) reach all members.
  3. Add the real committee members with the Committee profile.

### M6 — Rubric is one score, not category-specific · High
- **What happens:** Stage 2 asks for one "Assessment Score (0–100)" and comments. The PDF asks for category-specific rubrics; Mathematics has none defined.
- **Fix:**
  1. Get the criteria per category from the client.
  2. Add score fields per criterion with layout rules by category.
  3. Add them to Stage 2's "fields to fill when deciding".

### M7 — Missing form fields · Medium
- **Grade (الصف الدراسي):** the video rules require the candidate to state it. Add a picklist.
- **Team member:** Science and Technology team projects allow 2 participants. Client to confirm; if needed, add a second-participant name and National ID.
- **Consent / guardian approval:** candidates are minors. Client to confirm.

### M8 — Role logins not tested · Medium
- **What happens:** Stages 2–3 were decided by admin Takeover, not by the assessor and committee users.
- **Fix:** set passwords for one assessor and one committee user, then repeat T06–T15 logged in as them. This also covers M4.

### M9 — Age rule conflicts with the website · Medium
- **What happens:** the CRM accepts age 14–18 (`^1[4-8]$`), but the website says "Open to applicants aged 18+" and asks for an "Age" field and an ID copy.
- **Fix:** client decides the age range, then align the regex and the website text (`index.html` / `main.js` strings).

### M10 — Duplicate check by email · Medium
- **What happens:** National ID is unique, Email is not. The portal signs in by email, so two applications with one email clash.
- **Fix:** mark Email as unique on the module.

### M11 — No assessor alert · Medium
- **PDF:** internal assessor alert (recommended).
- **Not verified:** whether the approval sends an in-app notice.
- **Fix:** add an alert or email action to the category-owner rules: "New submission assigned: {{application_number}}".

### M12 — No deadline reminder · Medium
- **PDF:** N02 mentions a submission deadline.
- **Fix:** set the deadline, then add a scheduled workflow: X days before the deadline, if status = Registration Approved and the link is empty → reminder email.

### M13 — Student can't view status after submitting · Low (design choice)
- **What happens:** portal access ends after the video is submitted. This is good, because the link is effectively locked (PDF: "lock submission"). The cost is that the student follows the status only by email.
- **Fix:** keep as is. If the client wants status visible in the portal, the link field must become read-only per status, which the portal does not support today.

### M14 — Unused or risky leftovers · Low
These rules are switched off:
- "Reject under-18 applicants": **no condition**; it would reject every application.
- "Send portal access when approved": old status value.
- "دخول البوابة … (N02)": duplicate of Stage 1.
- "مالك الطلبات بدون فئة".

**Fix:** delete them, so nobody switches them on by mistake. "Profile Accessed" is never set by anything; that is acceptable (no notification is needed).

### M15 — Website wording · Low
- **What happens:** the page is branded "Education First Competition", while the portal and emails say "إبهار مصر".
- **Fix:** the client confirms the naming, then align the texts.

### M16 — Several people editing the same setup · Process
- **What happens:** during the session the approval stages were switched off by another edit and another tester's records were running at the same time.
- **Fix:** one owner for configuration changes until the demo, and a short change log in the ticket.

## 5. Suggested order of work

| Order | Item | Owner |
|---|---|---|
| 1 | M1 unblock the mailbox / move to a proper sender | Mail admin |
| 2 | M2 publish the web form (hidden status, required category) and update the site key | Dev (step 1) |
| 3 | M4 profile visibility and field permissions | CRM admin |
| 4 | M5 real assessor and committee users | Client + CRM admin |
| 5 | Re-test T01–T16 + M3 portal + M8 role logins, and confirm N01–N07 arrive | QA |
| 6 | M6, M7, M9 after the client answers (rubric, grade, team, consent, age) | Client → CRM admin |
| 7 | M10–M12, M14 small config items | CRM admin |
| 8 | Demo dry run with 4 candidates (one per category) | QA + PM |

## 6. Questions for the client
1. Age range: school students (14–18) or 18+?
2. Rubric criteria per category, including Mathematics.
3. Assessors per category, and who sits on the committee?
4. Grade, team-project partner, and guardian consent: required on the form?
5. Submission deadline and time zone (for N02 and reminders).
6. Naming on the site and in emails: "Education First Competition" or "إبهار مصر"?

## 7. Bugs for the developers (found 21 Oct 2026)

**Filed in Plane on 22 Oct 2026** (state Bug, CRM module, Sprint 12, Mahmoud Mohamed + Hegazy, labels Blueprint + Workflow Rules):
- **B-EM1 → NDC-2420** (Medium). Re-framed as an **inconsistency**. Zoho's help says workflow rules never run after blueprint transitions ([Troubleshooting Workflows](https://help.zoho.com/portal/en/kb/crm/troubleshooting/articles/troubleshooting-workflows); docs only). TAVI runs them after transitions without fields (N02 after «قبول التسجيل») but not after transitions with fields. Re-reproduced in the UI on 22 Oct on **EM-00094** (kept).
- **B-EM2 → NDC-2421** (High). Not reproduced on 22 Oct: 0 of 27 in 3 parallel batches (EM-00095 … 121, deleted). So far 5 lost updates in 45 parallel saves, all in the 21 Oct 15:36 batch.

Annotated images: `evidence/B-EM1-blueprint-transition-workflow-inconsistent.png` and `evidence/B-EM2-n04-field-update-lost-under-concurrent-saves.png` (sources in `evidence/bug-evidence-src/`). They couldn't be uploaded to Plane automatically, so they need to be dragged in.

Environment: https://crm.taviportal.com, tenant of `moaazdly89+edufirst@gmail.com`.
- **Module:** Competition Applications `ffb6202e-9ac2-49ba-a335-ef86c542450e`
- **Active blueprint:** "إبهار مصر — مراحل الطلب" `cda430d9-4c70-42fa-923f-a5a3d2f5fa5c`
- **Governed field:** `application_status`


### B-EM1 — Workflow rules don't run after a blueprint transition that saves fields

**Severity:** High. The Committee hand-over never happens, and any rule that reacts to these transitions is silently skipped.

#### What happens
A workflow rule with trigger **RecordUpdated** and criteria `application_status = "Assessment Complete" AND application_status CHANGED` is never evaluated when the status reaches Assessment Complete through the blueprint transition **"اعتماد الفيديو"**.
- No entry appears in `GET /workflow/executions` for that event, for this rule or any other.
- The record owner stays unchanged.

The same rule shape **does** run after a transition that has **no** "during" fields:
- After **"قبول التسجيل"** (Pending Verification → Registration Approved, no required fields), rule N02 runs every time. Its criteria are `application_status = "Registration Approved" AND application_status CHANGED`, and the log shows `RecordUpdated … Fired`.

#### Rule and transition involved
| Item | Definition |
|---|---|
| Rule `4e51785b-9efe-4174-97bd-eed125f5c5dd` "إبهار مصر — نقل الملكية للجنة بعد اعتماد الفيديو" | trigger `RecordUpdated`; criteria `application_status Equal "Assessment Complete" AND application_status CHANGED`; action `OwnerAssignment` / `RoleRoundRobin` / profile `53ece662-fefc-4ae5-8be9-920d7d5ea620` (Assessment Lead/Committee) |
| Transition `t-approve-video-science`, and the same for `-math`, `-technology`, `-arts` | Assessment Assigned → Assessment Complete; during: required fields `assessment_score`, `assessment_comments`; field validation `0 ≤ assessment_score ≤ 100`; no after-actions |
| Control: transition `t-approve-registration` | Pending Verification → Registration Approved; no required fields → rule N02 `12057f81-9263-423a-a0dd-261ff5e6d1fa` fires |

#### Steps to reproduce
1. Create a record in Competition Applications with `category = العلوم` and `application_status = Pending Verification`.
2. Run transition `t-approve-registration`: `POST /modules/{M}/records/{id}/blueprint-transitions/t-approve-registration` with body `{}`. → N02 fires (visible in `/workflow/executions`).
3. Set `submission_link`. Rules N04 → "مالك الفئة: العلوم" → "إسناد التقييم" move the record to `Assessment Assigned`, owner = a Science assessor.
4. As the assessor (or as the Owner account), run `POST /modules/{M}/records/{id}/blueprint-transitions/t-approve-video-science` with body `{"assessment_score": 77, "assessment_comments": "test"}`. → HTTP 200, status = `Assessment Complete`, score saved.
5. Wait 15–30 s and check:
   - **Expected:** rule `4e51785b…` runs and the owner moves to the Committee user (`pool-registration`).
   - **Actual:** the owner is unchanged and `/workflow/executions` has no entry for the record at that time.

#### Evidence (21 Oct 2026, UTC)
| Run | Record | Who pressed "اعتماد الفيديو" | Result |
|---|---|---|---|
| C1 | EM-00065 (Science), approved just after 15:06:31 | pool-science | owner stayed pool-science, no rule run |
| C2 | EM-00066 (Math), approved just after 15:14:22 | pool-math | owner stayed pool-math, no rule run |
| Probe | Arts record, approved ~15:21 | Owner account | owner stayed pool-arts, no rule run |

**Proof that the rule and its action work** (same probe record, still at Assessment Complete):
1. The `application_status CHANGED` condition was removed temporarily.
2. A harmless field (`school`) was edited.
3. The rule fired at **15:22:03.672** (`RecordUpdated`, criteriaMatched=true, outcome=Fired), and the owner moved to `pool-registration`.

So the rule and the RoleRoundRobin action are fine. What's missing is the RecordUpdated event from the transition. The rule was then restored.

#### Likely area (to confirm)
The transition-execution path that receives field values in the payload probably writes the record without emitting the RecordUpdated/workflow event, or emits it without the `application_status` change. Transitions without a payload emit it correctly. Please also check the other transitions with required fields: `t-reject-registration` (`rejection_reason`) and `t-correction-*` (`correction_request`). No rule depends on them today, so they weren't tested.

#### Expected behaviour
Every blueprint transition that changes `application_status` should trigger RecordUpdated workflow rules with the changed fields: the status plus any during-field values. That's how it already works for transitions with no fields.


### B-EM2 — Workflow field update is sometimes lost when several records are updated at the same moment

**Severity:** High. An application can be left at "Registration Approved" with a video link saved. No assessor is assigned, no error is shown, and nobody notices.

#### What happens
Rule N04 runs when the video link is saved, and its log entry shows **Fired** with its **email dispatch Succeeded**. But for some records its **FieldUpdate** action (status → Video Submitted, `video_submitted_at` → now) is **not applied**:
- The status stays `Registration Approved` and `video_submitted_at` stays empty.
- `errorMessage` is null, and the FieldUpdate leaves no trace in `dispatches`.
- Because the status never changes, the next rules ("مالك الفئة: …" and "إسناد التقييم") never run.

It happened only when 9 records were updated within the same few seconds, and not every time.

#### Rule involved
Rule `7f6fe481-e4d2-4a74-85e4-280a42c35e35` "إبهار مصر — تقديم رابط الفيديو (N04)":
- **Trigger:** `RecordUpdated`
- **Criteria:** `submission_link IsNotNull AND submission_link CHANGED AND application_status IN (Registration Approved, Profile Accessed, Action Required)`
- **Action 1:** `FieldUpdate` `application_status = "Video Submitted"`, `video_submitted_at = ${now}`. `application_status` is blueprint-governed, so this goes through the automatic transition `t-sys-video-1` (Registration Approved → Video Submitted).
- **Action 2:** Email, template `eea43ccc-f3cd-460d-9dda-511d32728d25`.

#### Steps to reproduce
1. Create 9 records with `category = الفنون`, status Pending Verification.
2. Run `t-approve-registration` on all 9 and wait until each has portal access.
3. Send 9 `PATCH /modules/{M}/records/{id}` with body `{"data":[{"field":"submission_link","value":{"kind":"string","value":"https://youtu.be/x-N"}}]}` **in parallel**, all within ~3–5 s.
4. After 60–90 s, check each record's status:
   - **Expected:** all 9 at `Assessment Assigned`, with an owner from the Arts profile.
   - **Actual:** some stay at `Registration Approved`.

#### Evidence (21 Oct 2026, UTC)
**Run 1:** 9 parallel saves at 15:36:38–15:36:40 (EM-00074 … EM-00082). **5 of 9 lost the update:** EM-00075, EM-00076, EM-00077, EM-00079, EM-00081.

| Record | N04 evaluated at | N04 outcome | Email | Status afterwards | `video_submitted_at` |
|---|---|---|---|---|---|
| EM-00081 | 15:36:40.343 | Fired | Succeeded | Registration Approved ❌ | empty |
| EM-00079 | 15:36:40.272 | Fired | Succeeded | Registration Approved ❌ | empty |
| EM-00075 | 15:36:40.303 | Fired | Succeeded | Registration Approved ❌ | empty |
| EM-00076 | 15:36:40.450 | Fired | Succeeded | Registration Approved ❌ | empty |
| EM-00077 | 15:36:40.496 | Fired | Succeeded | Registration Approved ❌ | empty |
| EM-00074 | 15:36:38.988 | Fired | Succeeded | Assessment Assigned ✅ | 15:36:38.988 |
| EM-00078 | 15:36:40.222 | Fired | Succeeded | Assessment Assigned ✅ | 15:36:40.222 |
| EM-00080 | 15:36:40.241 | Fired | (mail 422) | Assessment Assigned ✅ | 15:36:40.241 |
| EM-00082 | 15:36:40.584 | Fired | (mail 422) | Assessment Assigned ✅ | 15:36:40.584 |

- **Recovery:** re-saving the link on the 5 failed records **one at a time** worked straight away. Each went to Assessment Assigned with the correct round-robin owner.
- **Run 2:** 9 parallel saves at ~16:01:50 (EM-00083 … EM-00091). All 9 updated correctly. So the bug is **intermittent**.
- Run 1's records were deleted after the test. Run 2's records are still in the tenant.

#### Likely area (to confirm)
When the FieldUpdate targets the blueprint-governed field, it runs as an automatic blueprint transition. Under concurrent load, that write seems to fail (for example a row-version or lock conflict, or a transition-state check against a stale snapshot), and the failure is swallowed: the rule is still logged as Fired and the next action (the email) still runs. Please check the server logs for record EM-00075 / 76 / 77 / 79 / 81 around 15:36:40 UTC.

#### Expected behaviour
1. The field update is applied reliably under concurrent updates (retry on conflict).
2. If it really fails, the execution is logged as failed with the error, and the rest of the rule should not report success.
