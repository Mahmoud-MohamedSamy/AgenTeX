# Blueprint API | A malformed transition owner id returns .NET parser text instead of a readable error

**Summary**
Saving a blueprint whose transition owner id is not a valid id returns 422 with internal framework text instead of a readable message naming the transition.

**Steps to Reproduce**
1. Send POST /api/v1/modules/{tickets}/blueprints with a transition whose before.allowedUserIds = ["not-a-uuid"].
2. Read the error.

**Expected Result**
- 422 with a plain message naming the transition and the bad value (e.g. "Transition QA x: 'not-a-uuid' is not a valid user id"), like the message for an unknown id.

**Actual Result**
- 422 BLUEPRINT_DEFINITION_FIELD_INVALID on path "definition" with "The JSON value could not be converted to System.Guid. Path: $.transitions[0].before.allowedUserIds[0] | LineNumber: 0 | BytePositionInLine: 535."
- A valid but unknown id gives the readable "No user exists with id …" (fixed under NDC-3037).

**Environment**
staging-desk.taviportal.com (NDC-Staging), Microsoft Edge (headless) on Windows 10, 16 Nov 2026, owner account ndc-staging-owner.

**Suggested priority**: Low

**Related**: NDC-3037

**Evidence**: screenshots/annotated/BUG-blueprint-api-guid-parser-text-FAIL.png (spec scripts/specs-bugs/BUG-blueprint-api-guid-parser-text.json)


