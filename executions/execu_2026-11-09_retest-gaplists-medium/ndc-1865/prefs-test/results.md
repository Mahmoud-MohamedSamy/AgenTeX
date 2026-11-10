# CRM ⇄ Desk delete Preferences test, 10 Nov 2026 (NDC-Staging, mahmoud.mahamed1515)

Original values (restored and verified at the end): on_crm_delete=keep, on_crm_account_delete=keep, on_desk_contact_delete=keep, on_desk_account_delete=keep. Each option was changed with Save (PUT /desk/integrations/crm/config 200) only for its own test.

| Direction | Option | Test | Result | Verdict |
|---|---|---|---|---|
| Desk contact deleted | Never delete the corresponding CRM contact (original) | D1 | CRM copy kept | Works as labelled |
| Desk contact deleted | Delete the corresponding CRM contact | D2 | CRM copy deleted (404), in CRM Recycle Bin | Works as labelled |
| CRM contact deleted | Delete the corresponding Desk contact | C1 | Desk contact deleted (404), link "unlinked" | Works as labelled |
| CRM contact deleted | Delete only if nothing is linked | C3 (no ticket) | Desk contact deleted | Works as labelled |
| CRM contact deleted | Delete only if nothing is linked | C6 (with a Desk ticket) | Desk contact kept (200), link "unlinked" | Works as labelled |
| CRM contact deleted | Keep the Desk contact but unlink it | C4 | Desk contact kept, link "unlinked" | Works as labelled |
| CRM contact deleted | Keep the Desk contact and flag its link for review (original) | C5 | Desk contact kept, link "needs_attention"; Failure Log shows "The CRM record was deleted" | Works as labelled |
| Desk account deleted | Delete the corresponding CRM account | DA1 | CRM account deleted (404) | Works as labelled |
| CRM account deleted | Delete the corresponding Desk account | CA1 | Desk account deleted (404) | Works as labelled |

Not separately run: account "only if nothing is linked" and "keep but unlink" (same mechanism as contacts).

Zoho comparison: Zoho offers delete with linked records / delete only if not linked (else unlink) / never delete, both directions. TAVI covers the same choices for CRM→Desk (plus "keep and flag for review"); for Desk→CRM it offers only never / delete (no "only if not linked").

Item 1: fresh Overview screenshot evidence/raw/14-crm-desk-integration-now.png (16:00 UTC): Parked 168, Queued 2; Failure Log "168 records could not sync" (counts match).

Notes: the first change attempt didn't save (a selector picked "Never delete…" because it contains "delete the corresponding…"); nothing changed then. D1 ran under the original setting. C2 ticket create failed (422, HR) so C2 equals C3; the linked case was redone as C6 in Tech (the Tech "ticket created" rule may email Tech agents; the contact had no email). Staging DNS for staging-crm failed twice (retried).

Cleanup: 11 Desk records (8 contacts, 2 accounts, 1 ticket) and 10 CRM records deleted, Desk bin 11 and CRM bin 10 items purged; all 404, no QA PREF items left in either bin. Preferences verified back to the 4 original values (evidence/raw/p7-preferences-restored.png). Session file deleted.
