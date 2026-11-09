# Still-passes comments — Round 2 (27–28 Oct 2026)

Drafts only; nothing posted. Images in wave3/evidence/annotated (NDC-1333: wave4/evidence/annotated).

## NDC-2421

Image: wave3/evidence/annotated/NDC-2421-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Case W3-2421 (run 2, 27 Oct): an On Create workflow rule with a Field Update was applied to all 12 of 12 leads created at the same moment. This was a check with parallel creates on staging; the original report was intermittent parallel edits on the Education First tenant.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A and test user accounts, API; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2421-retest.png</p>
```

## NDC-2422

Image: wave3/evidence/annotated/NDC-2422-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Case A-10 (run 2, 27 Oct): with Online status ticked, the first member (a user with no session) was skipped and the lead went to the next member, the Supervisor. The control rule without the check gave the lead to the offline first member.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A, Supervisor and test user accounts, API; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2422-retest.png</p>
```

## NDC-2411

Image: wave3/evidence/annotated/NDC-2411-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Case A-17 (run 5, 28 Oct, run alone): with test user 2 suspended, the imported lead went to the fallback Default user (the Supervisor), not to the suspended member. Test user 2 was reactivated and read back as active.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A, Supervisor and test user 2 accounts, API; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2411-retest.png</p>
```

## NDC-2391

Image: wave3/evidence/annotated/NDC-2391-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Case F-02 (run 2, 27 Oct): a workflow rule with the condition Lead Owner = the user set by the assignment rule ran on the imported lead (execution logged Fired), and the owner was the expected user.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A and CRM Admin B accounts, API; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2391-retest.png</p>
```

## NDC-2334

Image: wave3/evidence/annotated/NDC-2334-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Case F-20 (run 2, 27 Oct, 3 tests): a deal in a blueprint edited to match an On Edit approval process got no approval and stayed in the blueprint (approval null, governed true). The control deal outside a blueprint went to pending approval.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A and test user accounts, API; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2334-retest.png</p>
```

## NDC-2323

Image: wave3/evidence/annotated/NDC-2323-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Case H-05 (run 2, 27 Oct, 3 tests): after converting the lead, its pending scheduled Field Update was not applied and its scheduled Webhook was never sent (no dispatch). The control leads that were not converted got both.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A and test user accounts, API; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2323-retest.png</p>
```

## NDC-2309

Image: wave3/evidence/annotated/NDC-2309-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Case F-01 (run 2, 27 Oct, 2 tests): the imported lead assigned by the Import-channel rule had the assigned owner (CRM Admin B) as its reviewer, it was in their review queue and they approved it (200). A manual control lead behaved the same.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A and CRM Admin B accounts, API; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2309-retest.png</p>
```

## NDC-2308

Image: wave3/evidence/annotated/NDC-2308-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Case F-03 (run 3, 28 Oct, 2 tests): the imported lead assigned by the rule had the assigned owner (CRM Admin B) as its approver, and they could approve. Run 2 had a test-side name clash (409) and was rerun from scratch.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A, CRM Admin B and test user accounts, API; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2308-retest.png</p>
```

## NDC-2298

Image: wave3/evidence/annotated/NDC-2298-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Case A-04 (run 2, 27 Oct, 2 tests): a rule limited to the API channel, named on an import, set no owner on the imported lead (rule skipped). The control rule with the Import channel set the owner.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A account, API; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2298-retest.png</p>
```

## NDC-2297

Image: wave3/evidence/annotated/NDC-2297-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Case H-02 (run 2, 27 Oct, 2 tests): converting a lead held for review is refused with 422 REVIEW_LOCKED for a test user and for CRM Admin A, and the review stays pending.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A and test user accounts, API; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2297-retest.png</p>
```

## NDC-2296

Image: wave3/evidence/annotated/NDC-2296-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Case H-03 (run 2, 27 Oct, 2 tests): converting a lead waiting for approval is refused with 422 APPROVAL_LOCKED for a test user and for CRM Admin B, and the approval stays pending.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin B and test user accounts, API; CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2296-retest.png</p>
```

## NDC-1333

Image: wave4/evidence/annotated/NDC-1333-retest.png

```html
<p><strong>Retest 27–28 Oct 2026 — still passes on the new build</strong></p><p>Settings › Activity Reminders now has one main scroll area (it had two); the two small lists inside are pickers.</p><p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), owner account, screen (Edge); CRM go-live round 2.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1333-retest.png</p>
```

## Dropped (no comment)

- NDC-2541 — WH-16 (approval webhook to a 500 receiver) was broken in run 2: approval state 404 (C-WH09), not rerun; WH-19 same. Not verified.
- NDC-2540 — WH-10 (After-transition webhook) passed: 1 request. But WH-11 (SLA escalation webhook) logged slaDueAt null, no field update and 0 requests in 614 s; the test only observes. SLA half not verified.
