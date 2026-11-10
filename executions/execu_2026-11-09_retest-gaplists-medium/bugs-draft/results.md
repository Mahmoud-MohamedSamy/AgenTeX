# Possible bugs from NDC-2636 / NDC-2635: TAVI facts (Lane E, 10 Nov 2026, NDC-Staging)

## Bug 1: reply composer refuses example.com addresses
- Cause (bundle `EmailTagInput-D3LoTAEm.js`, shared by the reply composer, Send-as-email, Schedule meeting and the Blueprint designer): `d(e)` checks `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, then rejects a top-level domain of `invalid`, `test`, `example` or `localhost`, and rejects any domain ending in `example.com`, `example.net` or `example.org` (subdomains too). The message is the generic "{email} is not a valid email address". It is a deliberate rule for the RFC 2606 reserved test domains, not a regex fault.
- UI, ticket #2224 (owner), Reply All → Recipients:
  - Refused: qa.rt2636@example.com, qa2636@example.com, info@example.org, user@sub.example.com, user@mail.test, user@company.example, user@localhost.
  - Accepted: qa.rt@anyware.software, first.last+tag@gmail.com, a@b.co.
  - Nothing was sent; all writes were blocked in the browser.
- Inconsistency: the Contacts API saved a contact with qa.rt2636@example.com (201), and the ticket's Contact Info shows that address. Only `EmailTagInput` has the reserved-domain check, so records accept addresses the composer refuses.
  - The composer did not prefill the contact's address on an API-created ticket, even after the address was changed to a valid one. So the prefill gap is not caused by the check, and the practical effect (an email-channel ticket from such a contact) was not reproduced.
- Assessment: this is a deliberate rule. The real issues are the misleading wording ("not a valid", when the address is valid but reserved) and the inconsistency with contact validation. Low severity.
- Evidence: raw/b1-rejected-example-com.png, b1-sub-example.png, b1-after-tries.png, b1-composer-contact-prefill.png, b1-composer-control-valid.png.

## Bug 2: activities from other departments visible to a plain agent
- Agent: "Customer Experience Specialists 2", profile Desk Agent, in Customer Support, QA NDC Manual Invoice and QA RT14 2754 Dept A. Not in HR.
- Owner created, in HR: ticket #2224, task "QA RT BUG dept task" linked to the ticket, and call "QA RT BUG dept call".
- As the agent:
  - Ticket: GET returns 403 PERMISSION_DENIED, and the ticket page shows "Permission denied.". Correct.
  - Task: GET /modules/{Tasks}/records/{id} returns 200 with the HR department. Call: also 200.
  - The task list API includes the task (total_count 397, the same as the owner's 397). The call list includes the call.
  - UI: Activities → All Activities shows (527), the same count as the owner. A search for "QA RT BUG" lists both HR activities.
  - Opening the task shows the full detail: Department HR, the owner, the status dropdown, the comment box, Start timer and Mark as Complete. A "Permission denied." toast appears because the linked ticket returns 403.
  - No edit or delete was tried.
- Owner list in Add Task (as owner): 121 users before choosing a department, and still 121 after choosing HR (4 agents) or QA AS6 Dept B (2 agents). The department's agents are in the list, but it isn't filtered to them.
  - Lane C's "ndc-staging-owner missing" was not reproduced as owner; it was seen as index 8.
- Evidence: raw/b2-agent-list-search.png, b2-agent-task-detail.png, b2-agent-activities-list.png, b2-agent-ticket.png, b2-owner-list-HR.png, b2-owner-list-QA_AS6_Dept_B.png.
  - The owner-list screenshots may show user emails, so crop them before use.

## Cleanup
- Contact, ticket, task and call deleted (204), and the 4 bin items purged (200).
- All 4 records return 404, and 0 bin matches are left.
- The scratchpad state files and the bundle copy are deleted. No tokens are in the folder.
