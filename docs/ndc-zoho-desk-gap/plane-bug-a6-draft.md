# Bug A-6: filed 3 Nov 2026 as NDC-2791 (re-scoped after the on-screen check)

**Title:** Layouts | "Mark as Required" on one layout makes the field required on every layout that has it
**Project:** NDC · **State:** Bug · **Priority:** High (NDC has 12 fields that are mandatory on some forms and optional on others)
**Assignees:** MahmoudMohamed, mfathy, Hegazy, eahmed · **Module:** Desk · **Cycle:** Sprint 14 · **Start:** 3 Nov 2026
**Related:** NDC-2787 (NDC usage gaps)

---

## Summary
In the ticket layout editor, "Mark as Required" on a field changes the field itself, not only the layout being edited. Every other
layout that contains the field then shows it as required too. So a field cannot be mandatory on one department's form and optional
on another's. NDC needs exactly that: in NDC's Zoho, Agent id is mandatory on Manual Invoice and optional on Client Complaints. In
total 12 NDC fields are like this, for example Description, Agency code, TKT number and IATA Source.

## Steps to Reproduce
1. Go to Setup → Layouts and Fields → Tickets. Open layout "QA NDC Manual Invoice" in Edit Page Layout.
2. On field "QA NDC Agent id", choose Mark as Required. Save.
3. Open layout "QA NDC Client Complaints" in Edit Page Layout. This layout also has QA NDC Agent id and was never edited.

## Expected Result
- Agent id is required only on the Manual Invoice layout. On Client Complaints it stays optional until it is marked there, as in
  Zoho Desk, where each layout has its own mandatory setting.

## Actual Result
- On the Client Complaints layout, QA NDC Agent id is shown as required (red bar and asterisk), although it was only marked on
  Manual Invoice. The create form for Client Complaints also shows it with an asterisk.
- The field's own setting is now required = true for the whole module.
- Saving is not consistent yet: a Manual Invoice ticket without Agent id is refused ("QA NDC Agent id is required."). A Client
  Complaints ticket without it is still saved, because that layout's stored copy was not refreshed. Any later save of the Client
  Complaints layout makes it required there too.

## Environment
- staging-desk.taviportal.com, NDC-Staging (company "Wonder Travel"), owner account, 3 Nov 2026. Checked on screen and through the API.
- Found while rebuilding NDC's Zoho Desk setup on TAVI (NDC-2787, item A-6).

## Withdrawn from the first draft
The first draft said layout mandatory flags are never enforced (#890, #895). That was wrong. Those flags were written straight into
the layout through the API, which the editor does not do. Mandatory fields set in the editor are enforced on save.

## Attachment
Annotated image: TAVI (Manual Invoice editor + Client Complaints editor) vs NDC's Zoho (Agent id mandatory on Manual Invoice, optional
on Client Complaints). The Zoho side still needs a read-only screen capture of NDC's Zoho.
