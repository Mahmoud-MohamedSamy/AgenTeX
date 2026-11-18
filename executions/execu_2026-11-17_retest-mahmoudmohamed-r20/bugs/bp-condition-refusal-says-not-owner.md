# Blueprint | Running a step whose condition is not met is refused with "You are not an owner of this transition."

**Summary**
When a step's "Shown when" condition is not met and someone runs it anyway (API, or a stale screen), the server refuses it (correct) but with the owner error: 403 BLUEPRINT_NOT_OWNER "You are not an owner of this transition." The step has no owner list and the person is the ticket owner, so the message points them and the developers at the wrong cause. Found while retesting NDC-3056.

**Steps to Reproduce**
1. Blueprint "QA RT20 BS 3056 flow" (Customer Support): step "QA end" Escalated → Closed, Shown when Priority = medium, no transition owners set.
2. Ticket #5117 is in Escalated, Priority Low, Ticket Owner = agent Customer Experience Specialists 2.
3. As that agent, run "QA end" on #5117 (POST /desk/tickets/{id}/blueprint-transitions/end).

**Expected Result**
- Refused with a condition error, e.g. 422 BLUEPRINT_CRITERIA_NOT_MET "This step needs Priority = Medium first."

**Actual Result**
- 403 BLUEPRINT_NOT_OWNER "You are not an owner of this transition." (transition_id end).
- The same error as a real owner-only step ("QA admin"), so the two cases cannot be told apart.

**Environment**
staging-desk.taviportal.com (NDC-Staging), agent CES2 + owner, API, 18 Nov 2026. Blueprint "QA RT20 BS 3056 flow" (off), tickets #5117, #4869.

**Suggested priority**: Low

**Related**: NDC-3056

**Evidence**: BUG-bp-condition-refusal-says-not-owner-FAIL.png
