# CRM + Desk Integration — features Zoho has that TAVI is missing

**Phase 1 draft for review — 18 Oct 2026, updated 19 Oct 2026 with the user's feature description.** Nothing has been filed in Plane yet.

- **TAVI:** staging-crm.taviportal.com + staging-desk.taviportal.com, owner account, read-only.
- **Zoho:** Zoho Desk `taviportal` + Zoho CRM org943261092, integrated live on 18 Oct 2026 (see "Changes made in Zoho").
- **PRD:** NDC-1669 "CRM Integration — Contacts, Accounts and Products Sync" (Backlog).
- **Related tickets:** NDC-1981 (Light agents) and NDC-1783 (Customers module).
- **Not related:** NDC-2069 and NDC-2195, which are about Omnichannel ↔ Desk.
- **Evidence:** `evidence/NN-*-vs-zoho.png`, with TAVI on the left and Zoho on the right. Originals are in `evidence/originals/`.

## How the feature should work (user, 19 Oct 2026)

- **Sync Settings:** Accounts and Contacts sync between CRM and Desk. Email (Primary) is the main field for matching contacts. Secondary Email can also be used for duplicate checks when the module has that field.
- **Sync Type:** Two-way Sync or CRM to Desk Sync, with field mapping for Accounts and Contacts. Sync can be paused and resumed.
- **Products** sync with the same sync types and field mapping. Two extras: pick the departments the products sync to, and optionally sync the product's customer (contact and account) associations.
- **Preferences (CRM side):** on deleting a CRM account / contact — Always delete in Desk · Delete in Desk if there are no associates · Never delete in Desk.
- **Preferences (Desk side):** on deleting a Desk account / contact — Always delete the corresponding record in CRM · Never delete it.
- **CRM Related Lists:** choose which CRM modules show support tickets (Leads, Contacts, Accounts, Deals, Products, Vendors, Cases).
- **Permissions:** per Desk profile, Accounts and Contacts are each set to No Access, Restricted Access or Full Access. This covers Account/Contact Information, Potentials, Notes and Activities (multi-select of activity types).
- **User decision:** TAVI should match how Zoho handles all of this, permissions included.

## Already done in TAVI

- Connect / Disconnect, Pause sync with an optional reason, and Resume. The Overview shows status, connected-since, last imports, and a live sync queue (queued / processing / failed / parked).
- Contacts and Accounts sync: Two-way or CRM → Desk, with per-field mapping that validates type mismatches, duplicates, read-only fields and pick lists.
- Delete preferences for each direction. Desk → CRM: never delete / delete. CRM → Desk: keep and flag / keep and unlink / delete.
- CRM Related Lists setting: Contacts, Accounts, Deals and Leads. Subscriptions is shown as "no ticket link".
- Sync History (last 7 days, per direction and per module, added/updated counts) with "Sync all customers" and "Sync all contracts".
- Failure Log with per-record Retry and Discard, plus Retry all.
- Desk profile permissions for CRM data: Full / Custom / No access, set separately for Accounts and Contacts. Custom access controls Info, Potentials, Notes and Activities (Calls / Meetings / Tasks).
- Ticket Visibility on the CRM side, with the same two options as Zoho.
- CRM notifications (signals): mention, created, comment, reply, overdue, escalated, rating, plus "notify the CRM contact owner".
- On Desk tickets, contacts and accounts, a CRM pane with Info / Potentials / Notes / Activities tabs, "Open in CRM", "Update from CRM", and a manual Link / Unlink to a CRM record.
- "Linked to CRM" and "Synced" badges, and the "Mapped / Unmapped with CRM" contact views.
- Handshake Mode on the ticket board, with the columns Customers / Potentials / Contacts-Leads / New.
- CRM users can be @mentioned in Desk (kind `crm_user`), and Light agents exist (NDC-1981).
- A Desk Tickets card on CRM records with statistics (all, open, overdue, average first response, average resolution, happiness), New ticket, Link / Unlink to a deal, Close, Update field and Delete.
- A full Desk ticket workspace inside CRM (reply, comment, forward).
- **TAVI extras that Zoho does not have:**
  - Closed-Won deals become Desk contracts, with draft / reopen / lost rules and a "needs attention" list.
  - Phone calls are copied into Desk.
  - Each mapped field has its own sync direction.
  - "Keep and flag for review" delete option.
  - Discard a failure.

## Missing — sync settings

1. **Products sync.** Zoho lets you pick which departments' products sync, offers "Also sync the product's customer (contact and account) associations", and has product field mapping. TAVI has no Products row, and `/desk/integrations/crm/products` returns 404. NDC-1669 §3, Phase 4. — `evidence/01-products-sync-vs-zoho.png`
2. **Limit the sync to chosen CRM list views.** Zoho has "All Accounts ▾" and "All Contacts ▾" pickers listing any CRM view. TAVI always syncs every record. NDC-1669 §2, Phase 1. — `evidence/02-crm-list-view-scope-vs-zoho.png`
3. **Match contacts on the secondary email**, with the overwrite warning. Zoho has "Email (Primary)" and "Secondary Email" tick boxes. TAVI always matches on the primary email; secondary email is only a mapped field. NDC-1669 §2, Phase 1. — `evidence/03-secondary-email-match-vs-zoho.png`
4. **"Delete in Desk only if there are no associates"** (for a CRM contact or account). TAVI offers keep-and-flag / keep-and-unlink / delete. Its two keep options are versions of Zoho's "Never delete". The Desk-side options (always / never delete in CRM) already match Zoho. NDC-1669 §5, Phase 2. — `evidence/04-delete-if-no-associates-vs-zoho.png`

## Missing — where agents see CRM data

5. **All CRM fields in the CRM pane.** Zoho shows every field of the CRM record, custom fields included. TAVI shows 8 fixed fields. The field list is stored in config (`panel.info_fields`), but there is no screen to change it. NDC-1669 §7, Phase 3 (field set not specified). — `evidence/05-crm-pane-fields-vs-zoho.png`

## Missing — CRM side

6. **More ticket filters on the CRM record**: Escalated, Overdue and High Priority. TAVI has All / Open / On hold / Closed. Not in NDC-1669. — `evidence/06-crm-ticket-filters-vs-zoho.png`
7. **Mutual Users list and "Invite users to Desk"** (as Agent / Light Agent / Admin) from the CRM integration page. TAVI's Permissions tab only has Ticket Visibility. NDC-1669 §9 adds CRM users as Light Agents automatically (Phase 4); an invite flow is not mentioned. — `evidence/07-mutual-users-invite-vs-zoho.png`

## Missing — automation

8. **"CRM Contact Type" condition in SLA and assignment rules** (Customer / Potential / Contact / Lead). In TAVI the classification is used only by the Handshake Mode columns. Not in NDC-1669. The Zoho side comes from the Zoho API docs, not a screen. — `evidence/08-crm-contact-type-criteria-vs-zoho.png`

## Missing — permissions

9. **Default CRM data access and level names.**
   - Right after connecting, Zoho lets only the Administrator profile see CRM data. Every other profile has no access until the admin ticks it.
   - TAVI starts every profile at Full Access ("Every profile has full access until you change one").
   - TAVI calls the middle level "Custom Access"; Zoho calls it "Restricted Access".
   - The rest matches: Accounts and Contacts set separately; Information, Potentials, Notes, and Activities with activity types.
   - NDC-1669 §6, Phase 3; the PRD does not state the default. — `evidence/09-permission-defaults-vs-zoho.png`

## Could not be checked (needs data or tenant changes; for Phase 3)

- **12-month lookback** on the first sync (NDC-1669 §4). Zoho states it on the configuration screen ("Only the records created or modified in the last year will be synced"); TAVI says nothing about it. Testing it needs CRM records older than 12 months. Please confirm whether staging has such records, so we can test whether TAVI excludes them.
- **Initial-sync progress and the "sync finished" notice to the admin** (NDC-1669 §4). Testing needs a fresh Connect. The integration on staging was connected today by a teammate. Please tell us when we may disconnect and reconnect.
- **Light Agents** (NDC-1669 §9): whether CRM users are added automatically without using a paid seat, and whether @mentions reach the CRM bell. Testing needs a mention on a real ticket.
- **Profile permissions enforced by the API** (NDC-1669 §6 AC, "disabling Deals blocks it at the API"). Testing needs a lower-profile Desk account with Custom access.

## Additional notes

- **Not gaps:**
  - Zoho's per-profile "Full Access" detail dialog matches TAVI's Custom Access.
  - Ticket Visibility, Handshake Mode, Sync History, Failure Log, Pause/Resume and the Desk tab in CRM are all built.
  - Creating CRM leads, deals or tasks from a Desk ticket is not native in Zoho either.
  - Lead sync and custom-module sync are NDC-1669 non-goals.
  - CRM Related Lists: Zoho offers Leads, Contacts, Accounts, Deals, Products, Vendors and Cases. TAVI offers Contacts, Accounts, Deals and Leads, plus Subscriptions marked "No ticket link". TAVI CRM has **no Products, Vendors or Cases modules** at all (`GET /modules`, 19 Oct 2026), so this is not an integration gap. Those modules should appear in this list once CRM has them.
- **Possible bug to check separately:** the Desk contact list shows raw values `synced` and `needs_attention` instead of labels (`originals/tavi/t09-desk-contact.png`).
- **Possible bug to check separately:** a Failure Log reason shows raw record UUIDs ("The CRM contacts record 514badee-… is already paired with Desk record cf51f6b3-…") instead of the record name, which NDC-1669 §10 asks to be human-readable (`originals/tavi/t05-crm-failure-log.png`).
- **Possible bug to check separately:** two Closed-Won deals sit in "needs attention" because account and end date are missing. The integration health check reports `deal_support_fields_present: false`.
- **Nothing was changed in TAVI.** The config baseline is in `reference/tavi-baseline-config-2026-10-18.json` (row_version 35570115).

## Changes made in Zoho (user-approved 18 Oct 2026)

- Zoho Desk `taviportal` is now **integrated** with Zoho CRM org943261092 ("Anyware Software"), with all settings left at their defaults:
  - Two-way sync.
  - Email (Primary) matching.
  - All Accounts / All Contacts.
  - Default field mapping (mostly "None").
  - Products **not** configured.
  - Delete preferences "Never delete".
- **The first sync copied:**
  - From CRM to Desk: 10 accounts and 10 contacts.
  - From Desk to CRM: 1 account and 2 contacts.
- The Desk ticket list was switched to Handshake Mode for one screenshot, then set back to Classic View.
- The integration is **still active**, so Phase 3 can compare live. Deleting it later stops the sync, but the copied records stay in both orgs.

## Environment

staging-crm.taviportal.com and staging-desk.taviportal.com; Edge; 18 Oct 2026; owner account (ndc-staging-owner). Zoho Desk Enterprise trial (15 days left) and Zoho CRM org943261092.
