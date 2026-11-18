# Workflow Rules | Add Tags shows "Succeeded" when no tag was added, and Target shows tag IDs

**Summary**
When a rule's Add Tags action adds nothing to the ticket (for example the only tag in the action belongs to another department, so it is correctly skipped), Execution History still shows the action as "Succeeded" with no details. The Target column also shows the tag's internal ID instead of its name. An admin cannot tell from the history that the action did nothing, or which tag it was about. Found while retesting NDC-3058.

**Steps to Reproduce**
1. Create a Desk workflow rule On Edit over Customer Support + QA AO Dept A, with Add Tags = the Customer Support tag "Accepted" only.
2. Edit a QA AO Dept A ticket that matches the rule (e.g. #5101).
3. Open the ticket: Tags (0), nothing was added (correct, the tag belongs to another department).
4. Open Setup > Workflow Rules > Execution History and open the run for that ticket.

**Expected Result**
- The Add Tags action shows that nothing was added (e.g. "Skipped") with the reason ("Tag Accepted belongs to Customer Support, not QA AO Dept A").
- Target shows the tag names, not IDs.

**Actual Result**
- Add Tags Status "Succeeded", HTTP and Details empty.
- Target "726771f4-c0a2-401c-8fde-3481e16881b1" (tag ID).
- The ticket has no tags.

**Environment**
staging-desk.taviportal.com (NDC-Staging), owner account, Edge + API, 17 Nov 2026. Ticket #5101; rule "QA RT20 W2 3058 wrong" (inactive).

**Suggested priority**: Low

**Related**: NDC-3058

**Evidence**: BUG-wf-add-tags-succeeded-nothing-added-FAIL.png
