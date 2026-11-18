# Blueprint | A just-made view-only agent can still be saved as transition owner for a short time

**Summary**
After an agent is made view-only in a department, Blueprint should refuse them as a transition owner (BLUEPRINT_OWNER_READ_ONLY, fixed in NDC-3065). Right after the change the refusal does not apply yet: about 3 seconds after making the agent view-only, saving a blueprint with that agent as owner was accepted (201) and setting them as a ticket's transition owner was accepted (200). The same requests one minute later were refused (422). The view-only change seems to reach Blueprint with a delay. Found while retesting NDC-3065.

**Steps to Reproduce**
1. Make agent CES2 view-only in department QA RT20 B2 Dept (Setup > Agents).
2. Within a few seconds, save a blueprint in that department with CES2 as transition owner (or PUT the ticket's blueprint owners with CES2).
3. Repeat the same request one minute later.

**Expected Result**
- The request is refused from the moment the agent is view-only: 422 BLUEPRINT_OWNER_READ_ONLY.

**Actual Result**
- About 3 s after the change: blueprint save 201 and owners PUT 200 (view-only agent accepted).
- One minute later: 422 BLUEPRINT_OWNER_READ_ONLY (correct).
- Not measured: the exact length of the delay (between 3 s and 1 min).

**Environment**
staging-desk.taviportal.com (NDC-Staging), owner account + agent CES2, API, 17 Nov 2026. Department "QA RT20 B2 Dept"; blueprints "QA RT20 B2 …" (off).

**Suggested priority**: Low

**Related**: NDC-3065

**Evidence**: BUG-bp-viewonly-owner-accepted-briefly-FAIL.png
