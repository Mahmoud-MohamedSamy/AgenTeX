# Plane drafts: webhooks (25 Oct 2026) — NOT published

Suggested for all four: project NDC, state Bug, module CRM, Sprint 12, assignee Hegazy (as the earlier CRM automation bugs). Evidence images are in `evidence/` (you drag them in after publishing).

---

## Draft 1 — Blueprint webhooks

**Title:** Blueprint | Webhook actions are never sent (After transition and SLA escalation)
**Priority:** High · **Labels:** Blueprint (+ Workflow Rules if no Blueprint label) · **Evidence:** `WH-10-blueprint-webhooks-never-sent-vs-zoho.png`

**Summary**
A Webhook action in a blueprint never sends anything. This happens both in a transition's After actions and in a state's SLA escalation. The transition and the escalation themselves run, and the other actions in them (Field Update, Task, Email) work. In Zoho, webhooks are valid After-transition and SLA-escalation actions.

**Steps to reproduce**
1. Settings → Blueprints → a blueprint on Leads, field Lead Source, states chat → web → referral.
2. On the transition "chat to web", add an After action **Webhook**, POST to a request catcher (for example a webhook.site URL). Save and activate.
3. Create a lead with Lead Source = chat, then run the transition "chat to web".
4. Check the request catcher.
5. Second check: give the state "chat" an SLA of 1 minute with escalation actions Field Update (Description = "SLA escalated") and Webhook (same catcher). Create a lead with Lead Source = chat and wait 3 minutes.

**Expected result**
- One POST arrives after the transition.
- One POST arrives when the SLA escalates.

**Actual result**
- After transition: the lead moves to "web", but no request arrives (watched for 105 s).
- SLA: the Field Update applies at about 1.5 minutes, but no request arrives in 9 minutes (with the webhook placed first or last).
- Control: a workflow rule webhook to the same kind of catcher arrives in about 1 second.

**Request**
POST /api/v1/modules/{leads}/blueprints with transition after.actions = [{"kind":"webhook","url":"https://webhook.site/…","verb":"POST"}] (exactly what the designer saves). Then POST /api/v1/modules/{leads}/records/{id}/blueprint-transitions/{transitionId} → 200.

**Response**
- After transition (case WH-10): lead 66b725b9…, lead_source = web after the transition; 0 requests received.
- SLA (case WH-11): leads a54b3230… and 46bbe8bb…, description = "QA WH-11 SLA escalated" at +84 s; 0 requests received after 535 s.

**Evidence**
Side-by-side image (CRM vs Zoho) attached.

**Environment**
staging-crm.taviportal.com, API, 25 October 2026, CRM Admin account.

**Additional notes**
- The designer offers Webhook in both places, so admins can set it up and nothing happens.
- When this is fixed, blueprint webhooks also need the URL check from Draft 2.
- Zoho source: https://www.zoho.com/crm/developer/docs/api/v8/create-blueprint.html (after-transition actions include "webhooks"; escalation actions include "webhooks").

---

## Draft 2 — Internal addresses (security)

**Title:** Webhooks | Cloud metadata address is not blocked, and blueprint / review webhooks accept internal URLs
**Priority:** Urgent (security) · **Labels:** Workflow Rules, Blueprint · **Evidence:** `WH-13-internal-webhook-addresses-vs-expected.png`

**Summary**
Workflow rule webhooks refuse internal addresses when the rule is saved. Blueprint webhooks and the review process webhook URL save them without any check. At run time, the outbound egress policy blocks host names that point to 127.0.0.1, but **not** ones that point to the cloud metadata address 169.254.169.254: the server tried to connect (it timed out and booked a retry). An admin can therefore make the server send requests to the cloud metadata service (SSRF).

**Steps to reproduce**
1. Workflow rule on Leads, On Create, Webhook POST to `http://169.254.169.254.nip.io/latest/meta-data/` (a host name that resolves to 169.254.169.254). It saves.
2. Activate the rule and create a matching lead.
3. Open the rule's execution for that lead and read the webhook dispatch.
4. Repeat with `http://127.0.0.1.nip.io/`.
5. Blueprint: add an After webhook to `http://169.254.169.254/latest/meta-data/` and save.
6. Review process (API): POST /workflow/review-processes with webhookUrl `http://169.254.169.254/latest/meta-data/`.

**Expected result**
- Every webhook place refuses loopback, private, link-local (169.254.0.0/16) and internal addresses when saved, the way workflow rules already do.
- At run time, the egress policy also blocks host names that resolve to 169.254.0.0/16.

**Actual result**
- 127.0.0.1.nip.io: dispatch Cancelled, "[custom-actions-egress-blocked] resolves only to addresses blocked by the outbound egress policy" (correct).
- 169.254.169.254.nip.io: dispatch Pending, attempts 1, lastError "timeout", retry booked (not blocked).
- Blueprint After webhook to 169.254.169.254 or 127.0.0.1: saved (201).
- Review process webhookUrl to 169.254.169.254: saved (201).

**Request**
- POST /api/v1/workflow/rules with actions[0].url = http://169.254.169.254/latest/meta-data/ → 400 "Webhook Url must be a public http(s) endpoint; loopback, private, link-local, and internal addresses are not allowed" (correct).
- Same with url = http://169.254.169.254.nip.io/latest/meta-data/ → 201.
- POST /api/v1/modules/{leads}/blueprints and POST /api/v1/workflow/review-processes with the same address → 201.

**Response**
GET /api/v1/workflow/executions/{executionId} → dispatches[0]: status Pending, attempts 1, lastError "timeout", responseStatus null (case WH-14).

**Evidence**
Side-by-side image (CRM vs expected) attached.

**Environment**
staging-crm.taviportal.com, API, 25 October 2026, CRM Admin account.

**Additional notes**
- No response came back from 169.254.169.254, so nothing was read. On a cloud host where the metadata service answers, the response body is stored in the dispatch log (responseBodyTruncated) and shown to admins.
- The test rule was deleted, but the pending dispatch had a retry booked for about 10 minutes later.
- Blueprint webhooks are not sent at all today (Draft 1), so their missing check becomes live once Draft 1 is fixed.
- Reference: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html

---

## Draft 3 — Review process webhook

**Title:** Review Process | webhookUrl only sends the reject event and is not signed
**Priority:** Medium · **Labels:** Review Process (+ Workflow Rules if none) · **Evidence:** `WH-12-review-webhook-reject-only-unsigned.png`

**Summary**
A review process can have a webhookUrl (API only, with no field on screen). It calls the URL only when a review is rejected. Nothing is sent when a record is submitted or approved. The request has a timestamp header but no signature, so the receiver can't prove it came from TAVI. Zoho's review process has no webhook, so this is judged against TAVI's own design: the payload carries an "event" field, which implies several events.

**Steps to reproduce**
1. POST /api/v1/workflow/review-processes with webhookUrl = a request catcher, on Leads, Manual channel, reviewed field Email. Activate it.
2. As a user, create a lead → it waits for review. Check the catcher.
3. As the reviewer, approve it. Check the catcher.
4. Create a second lead and reject it. Check the catcher.

**Expected result**
- One event each for submitted, approved and rejected (or whichever events are designed, documented).
- A signature header (for example an HMAC of the body with a per-process secret).

**Actual result**
- Submitted: nothing. Approved: nothing.
- Rejected: one POST with x-anyware-event: review.rejected and x-anyware-timestamp, and no signature.

**Request**
POST /api/v1/workflow/review-processes {"webhookUrl":"https://webhook.site/…", …} → 201.

**Response**
Request received (case WH-12): {"event":"review.rejected","processName":"QA AEO V7 WH-12 RP","recordId":"aa752eb8…","rejectedFields":[{"fieldKey":"email","reasonLabel":"Invalid Entry",…}]}.

**Evidence**
Image attached.

**Environment**
staging-crm.taviportal.com, API, 25 October 2026, CRM Admin account.

**Additional notes**
- The webhookUrl has no URL check either (see Draft 2).
- Possibly unfinished: there is no field for it on the review process screen.

---

## Draft 4 — ${owner} empty in approval webhooks

**Title:** Approval Process | ${owner} merge field is empty in Call Webhook actions
**Priority:** Low · **Labels:** Approval Process (+ Workflow Rules if none) · **Evidence:** `WH-08-approval-webhook-owner-empty-vs-zoho.png`

**Summary**
The same webhook body template sends the record owner from a workflow rule, but sends an empty owner from an approval process (after approval and after rejection). Other merge fields (recordId, moduleId, first_name) are filled in both.

**Steps to reproduce**
1. Approval process on Leads, approver user A, After final approval → Call Webhook, POST to a request catcher, body {"recordId":"${recordId}","owner":"${owner}"}.
2. Create a matching lead and approve it as user A.
3. Compare with a workflow rule On Create using the same webhook body.

**Expected result**
- "owner" is the lead owner in both.

**Actual result**
- Workflow: "owner":"3445ec4a-…" (the owner).
- Approval, after approve and after reject: "owner":"".

**Response**
Cases WH-08 (lead c1854c85…) and WH-09 (lead e64ea33c…): "owner":"". Case WH-01 (workflow, lead eba4bdbe…): owner filled.

**Evidence**
Side-by-side image (CRM vs Zoho) attached.

**Environment**
staging-crm.taviportal.com, API, 25 October 2026, CRM Admin account.

**Additional notes**
- Assignment rules currently set no owner (NDC-2419), but these leads were created by hand, not by an assignment rule.
- Zoho source: https://help.zoho.com/portal/en/kb/crm/automate-business-processes/actions/articles/webhooks-workflow
