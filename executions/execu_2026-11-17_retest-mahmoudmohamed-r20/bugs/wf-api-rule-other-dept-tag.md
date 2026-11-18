# Workflow Rules | API saves a single-department rule with another department's tag

**Summary**
In the rule editor, a rule limited to one department offers only that department's tags (fixed in NDC-3058). The workflow rules API does not apply the same check: it saves a rule limited to QA AO Dept A whose Add Tags action uses a Customer Support tag (201). The rule can then never add that tag, but it shows "Succeeded" each time it runs. Found while retesting NDC-3058.

**Steps to Reproduce**
1. POST the Desk workflow rules API (Tickets, On Edit) with departmentIds = [QA AO Dept A] and an Add Tags action with the Customer Support tag "Accepted".
2. Look at the response.
3. Open a rule limited to QA AO Dept A in the editor and open the Add Tags list.

**Expected Result**
- The API refuses the rule (422) with a clear message, e.g. "Tag Accepted belongs to Customer Support. Use a tag from the rule's department.", matching what the editor allows.

**Actual Result**
- 201: the rule is saved with the other department's tag (rule "QA RT20 W2 3058 bad").
- The editor would not offer that tag for this rule.

**Environment**
staging-desk.taviportal.com (NDC-Staging), owner account, API + Edge, 17 Nov 2026. Rule "QA RT20 W2 3058 bad" (inactive).

**Suggested priority**: Low

**Related**: NDC-3058

**Evidence**: BUG-wf-api-rule-other-dept-tag-FAIL.png
