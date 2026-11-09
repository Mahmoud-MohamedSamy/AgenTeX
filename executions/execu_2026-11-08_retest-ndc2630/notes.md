# NDC-2630 retest, 8 Nov 2026 (NDC-Staging, owner)
Result: PASS for failed-send handling. Success control (EmailSent on a real send) not run: no sender can send on this tenant.
Screen failure check overrode GET /emails/sendability in the test browser only (a6.js); the 550 came from the server.
Plane: draft in plane-draft-2630.html, NOT posted. Cleanup pending: see ledger.md (lead, 2 drafts + screen failure email).

## 9 Nov 2026
User approved post + Done + cleanup. Ticket found In Progress (dev moved Bug -> In Progress 9 Nov 10:19), so NOT posted, state untouched. Cleanup done: lead cac2e850 deleted 204 + bin purged, drafts 92a9e4c0 / c888686e deleted 204. owner.json deleted.
