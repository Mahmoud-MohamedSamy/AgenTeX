# NDC-1865 feature 10 Data Administration (excl. Backup): Lane K, 10 Nov 2026

NDC-Staging, mahmoud.mahamed1515. Completes Lane H's partial check (Recycle Bin delete/restore/purge + Audit Log restore entry were already proven).

| Sub-feature | Verdict | What was seen |
|---|---|---|
| Import | Working | Contacts, 2-row CSV: Upload → Operation (Add new) → Map (3/3 auto) → Assign → Review ("All 2 rows passed validation") → confirm checkbox → Submit. Result "Import complete: 2 added, 0 updated, 0 skipped, 0 errors"; Import history row Completed. Both contacts exist and synced to CRM at once. |
| Undo import | Working | Import history → ⋮ → Undo import → "The records added … will be moved to the recycle bin". Status → Undone; both contacts 404 and in the Recycle Bin. |
| Resume / finding F | Not a bug | Leaving the wizard and reopening Import shows "You have an import in progress for this module" with Start over / Resume. Resume continues at the saved step and the import completed. It is a resumable draft, not a blocker. |
| Export | Working | Contacts, CSV, all records: file downloads at once (desk_contacts-export-20261110-1354.csv, 16 rows, 26 columns incl. CRM Record ID / Sync Status); toast "16 records exported…"; Export history row Completed with Download. |
| Mass update | Working | Contacts list → select 2 → Update → Title = "QA FT 1865 K bulk" → "2 records updated" (both read back). |
| Bulk Actions Log | Partly | Lists Import (2/2 Completed), Export (16), the Undo (Import … Undone) and earlier Mass deletes, but NOT the Mass update of 2 contacts. |
| Audit Log | Working (wording issues) | Entries for import (imported qa-ft-1865-k-contacts.csv), each created/updated record, mass-update record changes, and export. Export wording is odd: "exported the audit log (16 Contacts (csv))" and "added a Desk data export named 0 Contacts (csv)". |

Small notes: Import history shows the import at 15:24 (session start) while Bulk Actions Log and Audit show 15:31 (run). Staging was slow (login page ~90 s, 2 network drops).

Emails: export notifies the exporter (mahmoud.mahamed1515's own mailbox), 1 email. Import email checkbox was off.

Cleanup: import undone → 2 Desk contacts in bin → purged (200); their CRM copies 50e614c4 / cda72981 deleted (204) and CRM bin purged (200); all 4 return 404, both bins clear, 0 search hits. Export history row stays (no delete in UI). The downloaded CSV in evidence/ holds 16 staging contacts' data: keep it local, do not commit.
