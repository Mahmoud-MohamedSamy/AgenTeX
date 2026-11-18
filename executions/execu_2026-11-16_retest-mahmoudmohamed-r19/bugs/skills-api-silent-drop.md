# Ticket Skills | Inactive and other-department skills are silently dropped on save while a deleted skill is refused

**Summary**
When a ticket is created or edited with a list of skills, a deleted or unknown skill is refused with 422 "not one of the allowed values", but inactive skills and skills of another department are accepted with 200/201 and silently removed. The caller is not told which skills were dropped, and an edit that sends only another department's skill removes all skills from the ticket. Found while retesting NDC-2933 and NDC-2971; re-run fresh at 12:27Z.

**Steps to Reproduce**
1. In QA AS6 Dept A (skills S1, S2 active, "QA RT19 AS Inact" inactive), create a ticket through the Records API with skills [S1, QA RT19 AS Inact].
2. Create a ticket with skills [S1, QA SK13 S1] (a skill of another department).
3. Edit a ticket with skills [S2, QA RT19 AS Inact], then [S2, QA SK13 S2].
4. Edit a ticket with only [QA SK13 S2].
5. For comparison, create or edit a ticket with [S1, QA RT19 AS Del] (a deleted skill) or with a skill name that does not exist.

**Expected Result**
- One rule for every skill that is not allowed: either refuse the request with 422 naming each such skill (as for a deleted skill), or save and return a warning listing the skills that were dropped.

**Actual Result**
- Deleted skill and unknown skill: 422 RECORD_VALIDATION_FAILED, "Skills: '<name>' is not one of the allowed values." on create and on edit; nothing saved (correct).
- Inactive skill on create: 201, #4618 saved with S1 only, no warning.
- Other-department skill on create: 201, #4619 saved with S1 only, no warning.
- Inactive / other-department skill on edit: 200, #4620 saved with S2 only, no warning.
- Edit with only another department's skill (NDC-2933 run, 11:4xZ): 200, the ticket's skills become empty, no warning.

**Environment**
staging-desk.taviportal.com (NDC-Staging), owner account, Records API, 16 Nov 2026 12:27Z.

**Suggested priority**: Low

**Related**: NDC-2933 (the ticket page Edit Skills list still offers these skills and drops them without telling the user — tracked there), NDC-2971

**Evidence**: BUG-skills-api-silent-drop-FAIL.png
