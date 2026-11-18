# Blueprint API | A save that sends no revision is accepted and silently overwrites a newer change

**Summary**
The NDC-3030 fix refuses a stale save that sends an old revision, but a save that sends no revision at all is still accepted and replaces the newer version. The designer always sends a revision; scripts or integrations that omit it can still lose other people's changes.

**Steps to Reproduce**
1. GET a blueprint (revision 11).
2. Save a rename with revision 11 (200, revision 12).
3. From the copy read in step 1, save a description change through PUT /blueprints/{id} (and PUT …/draft) without a revision field.
4. GET the blueprint.

**Expected Result**
- The save without a revision is refused (409, or 422 "revision is required"); the rename stays.

**Actual Result**
- Both saves answer 200.
- The name is back to the old one; the rename is lost with no warning. The same call with revision 11 gets 409 BLUEPRINT_REVISION_CONFLICT.

**Environment**
staging-desk.taviportal.com (NDC-Staging), Microsoft Edge (headless) on Windows 10, 16 Nov 2026, owner account ndc-staging-owner.

**Suggested priority**: Low

**Related**: NDC-3030 (designer path fixed)

**Evidence**: screenshots/annotated/BUG-blueprint-save-without-revision-overwrites-FAIL.png (spec scripts/specs-bugs/BUG-blueprint-save-without-revision-overwrites.json)


