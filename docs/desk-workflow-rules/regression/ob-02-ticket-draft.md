# FILED as NDC-3196 on 23 Nov 2026 — final text in Plane is refined: fails only when the rule is limited to departments; toast "Something went wrong on our side. Try again in a moment."; old result stays on screen.

# OB-02 — ticket draft (not filed)

| Field | Value |
|---|---|
| Project | NDC |
| Title | Workflow Rules \| "Test rule" on a new, unsaved rule always fails with "An unexpected error occurred" |
| Priority | Medium (suggested) |
| Labels | Workflow Rules |
| Assignees | MahmoudMohamed, mfathy, Hegazy |
| State / module / cycle | Bug · Desk · Sprint 17 |
| Duplicates checked | none found in Plane ("Test rule", "unexpected error", "sample record") |

---

## Summary

**Test rule** lets an admin check a rule against a sample ticket before using it. On a rule that has not been saved yet, it always fails with "An unexpected error occurred. Please try again." It fails whether or not the sample matches the conditions. Test rule on a saved rule works. So the only way to try a new rule is to save it and let it run on real tickets.

## Steps to Reproduce

1. In Desk, go to **Settings → Automation → Workflow Rules → New Rule**. Pick module **Tickets**, enter a name and go to the editor. **Do not save.**
2. Keep the trigger **On Create**. Add the condition **Priority is High** and the action **Field Update** (any field and value).
3. Open the **⋯** menu at the top right and choose **Test rule**.
4. In the test panel, set the sample record to a ticket with Priority **High**, then run the test.
5. Change the sample to Priority **Low** and run the test again.

## Expected Result

- Step 4: the panel shows that the sample **matches** and lists the actions that would run (the Field Update).
- Step 5: the panel shows that the sample **does not match** and that no actions would run.
- Nothing is saved and no real ticket is changed.

## Actual Result

- Both runs fail with **"An unexpected error occurred. Please try again."**; no result is shown.
- The server answers **HTTP 500** with error code `INTERNAL_ERROR`.
- **Control:** after the rule is saved, Test rule on the same rule works. It answers match / no match and lists the actions.
- Seen every time:
  - 4 tries on 22 Nov (a sample record id and a real ticket id);
  - 2 tries on 23 Nov (matching and non-matching sample).

## Note

- The test panel's default sample data is a CRM field (`{"revenue": …}`) instead of a ticket field. This is tracked separately as a Low draft (UX-09).
- Developer pointer: an unsaved rule is sent to `POST /api/v1/workflow/rules/evaluate` with `{ rule, sampleRecord: { recordId, triggerKind, fields } }`, and this call returns 500. A saved rule is sent to `POST /api/v1/workflow/rules/{id}/execute`, which works.

## Environment

- App: Anyware Desk (staging) — staging-desk.taviportal.com (NDC-Staging), owner account
- Browser: Microsoft Edge, Windows 10; API checks with the same account
- Dates: 22–23 Nov 2026

## Attachment

- Screenshot of the New Workflow Rule editor (OB02-new-editor.png). The error toast itself was not captured: browser sign-in is failing on 23 Nov, so a fresh screenshot or a Jam should be added before filing.

## API reproduction (optional section for the developer)

```http
POST /api/v1/workflow/rules/evaluate
{
  "rule": {
    "moduleId": "88e8ea44-1658-4df3-9930-d0902b91073d",
    "name": "Test draft",
    "mode": "Recurring",
    "trigger": { "kind": "RecordCreated" },
    "criteria": { "kind": "Comparison", "field": "priority", "operator": "Equal", "value": { "kind": "string", "stringValue": "high" } },
    "actions": [ { "order": 0, "delaySeconds": 0, "type": "FieldUpdate", "fieldUpdates": { "qa_ndc_company_name": { "kind": "string", "stringValue": "T" } } } ],
    "departmentIds": [ "4853562a-0b4d-45cb-ba34-9f2118fcd32c" ]
  },
  "sampleRecord": {
    "recordId": "rec-sample",
    "triggerKind": "RecordCreated",
    "fields": { "priority": { "kind": "string", "stringValue": "high" } }
  }
}
```

Response:

```json
500 {"success":false,"data":null,"error":{"code":"INTERNAL_ERROR","message":"An unexpected error occurred. Please try again."},"meta":null}
```
