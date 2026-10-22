// CRM ⇄ Desk Integration run, 19–20 Oct 2026: evidence images + bug-report.html.
// node cdi-bugs.js  -> <id>-api.json/.png (make-api-shot.js), <id>.json -> ../<id>-<slug>-vs-zoho.png (make-evidence.js), ../../bug-report.html
// TAVI side = real screenshots (automation/target/evidence, copied to ./shots) or annotated request/response from the run logs
// (run1 report, run2-facts.txt, run3 log; tokens are never logged). Zoho side = live Zoho screenshot where Zoho shows the
// behaviour, otherwise Zoho help text / NDC-1669 (flagged as such).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const HERE = __dirname;
const S1 = 'https://help.zoho.com/portal/en/kb/desk/integrations-and-marketplace/sales-and-marketing/articles/integrating-zoho-desk-with-zoho-crm';
const S8 = 'https://help.zoho.com/portal/en/kb/desk/ticket-management/articles/ticket-work-modes';
const c = s => `<code>${s}</code>`;

const bugs = [
  { id: 'CD-01', case: 'I9 / I8', sev: 'High', area: 'Links', slug: 'unlink-does-not-stop-sync',
    title: 'Unlink does not stop the sync: the next change links the pair again by email',
    summary: 'After Unlink, TAVI\'s own dialog says "Syncing stops for this record until it is linked again." In practice the very next change on the CRM record matches the Desk contact again by email (' + c('match_source: match_existing') + ') and the change is written to Desk. An agent cannot keep a Desk contact apart from its CRM record.',
    steps: ['Take a linked contact pair (Desk contact ↔ CRM contact, same email).', 'Desk contact → CRM pane → Unlink → confirm (API ' + c('DELETE /desk/integrations/crm/links/{id}') + ' → 204).', 'In CRM, change the contact\'s Title.', 'Wait 40 s and open the Desk contact.'],
    expected: 'The record stays unlinked and the CRM change is not written to Desk, as TAVI\'s Unlink dialog promises ("Syncing stops for this record until it is linked again.").',
    actual: 'Link back as ' + c('synced / match_existing') + '; Desk Title = the CRM value; a manual Link afterwards answers 409 "The crm record is already linked."',
    records: 'Desk contact ' + c('1e4fa020') + ' ↔ CRM contact ' + c('f820d08f') + ' (20 Oct, deleted after the run)',
    taviCaption: 'Unlink 204, then the CRM edit re-links the pair and syncs',
    blocks: [
      { head: 'Linked pair: Desk 1e4fa020-… ↔ CRM f820d08f-… (QA CD G2)', lines: [
        'DELETE /desk/integrations/crm/links/{link id}  -> 204',
        'PATCH  /modules/{crm contacts}/records/f820d08f-…  {title: "I9 after unlink"}  -> 200',
        { t: 'after 40 s: Desk title = "I9 after unlink", crm_sync_status = synced', box: 'change still synced' },
        { t: 'GET /links -> {crm f820d08f, desk 1e4fa020, synced, match_source: match_existing}', box: 'linked again' },
        'POST /desk/integrations/crm/links {kind:contact, crm_record_id, desk_record_id} -> 409 "The crm record is already linked."'] },
      { head: 'TAVI Unlink dialog text (locale crm-desk-integration, panel.unlinkBody)', lines: [
        { t: '"The CRM markers are cleared. Syncing stops for this record until it is linked again."', box: 'promise broken' }] }],
    zohoCaption: 'Zoho: the link is the mapping; only matching on create', zohoText: [
      'Zoho has no per-record Unlink button; a mapping is removed only by the delete preferences ("only the mapping is removed").',
      'Expected here: TAVI\'s own promise — syncing stops for the unlinked record until it is linked again.'], zohoSources: [S1],
    rows: [{ n: '1', b: 'Unlink a linked contact', zoho: 'No per-record unlink (mapping removed only by delete preferences)', tavi: '204, link removed', match: 'TAVI extra' },
      { n: '2', b: 'CRM change after unlink', zoho: '—', tavi: 'Pair re-linked by email; change written to Desk', match: 'Differs' }] },

  { id: 'CD-02', case: 'K10', sev: 'Medium', area: 'Handshake Mode', slug: 'handshake-offered-while-paused',
    title: 'Handshake Mode is still offered while the sync is paused',
    summary: 'With the integration paused, the ticket list Layout picker still lists Handshake Mode under Work Modes, so agents keep sorting tickets by CRM deal data that is no longer updated. When disconnected, the option is hidden correctly.',
    steps: ['Desk → Settings → CRM ⇄ Desk Integration → Pause sync (any reason).', 'Desk → Tickets → All Tickets → open the Layout picker ("Classic View ▾").', 'Control: Disconnect, open the picker again.'],
    expected: 'Handshake Mode is removed from the picker with an explanation while paused or disconnected (NDC-1669 §8 AC). Zoho: Handshake needs the integration; pausing stops all data exchange.',
    actual: 'Paused: Handshake Mode listed and selectable. Disconnected: hidden (correct).',
    records: 'Checked twice on 20 Oct (ConnectionRunTest, K10CheckTest); status ' + c('paused=true') + ' at the screenshot',
    taviImg: 'shots/K10-paused-picker.png', taviCaption: 'Layout picker while the sync is paused', taviBoxes: [{ n: 1, x: 1258, y: 388, w: 222, h: 30 }],
    zohoCaption: 'Zoho docs + NDC-1669', zohoText: [
      'Zoho: "Pause Sync stops all data exchange." Handshake work mode "needs the integration" and classifies by CRM data.',
      'NDC-1669 §8 AC: when the integration is paused or disconnected, Handshake Mode is removed from the picker with an explanation.'], zohoSources: [S1, S8],
    rows: [{ n: '1', b: 'Picker while paused', zoho: 'Not offered (PRD §8)', tavi: 'Handshake Mode offered', match: 'Differs' },
      { n: '—', b: 'Picker while disconnected', zoho: 'Not offered', tavi: 'Not offered', match: 'Same as Zoho' }] },

  { id: 'CD-03', case: 'H10 / G19', sev: 'Medium', area: 'Failure Log', slug: 'failure-reason-raw-ids',
    title: 'Failure Log reasons show raw record ids instead of record names',
    summary: 'Every "already paired" failure reads "The CRM contacts record ' + c('514badee-c11a-…') + ' with the same email is already paired with Desk record ' + c('cf51f6b3-cc88-…') + '." An admin cannot tell which contacts are involved. Reproduced on 20 Oct with two Desk contacts sharing one CRM email.',
    steps: ['Create two Desk contacts with the same email while a CRM contact with that email exists (or pause, create, resume).', 'Desk → Settings → CRM ⇄ Desk Integration → Failure Log.'],
    expected: 'The reason names the records (e.g. "already paired with Desk contact Mahmoud Mohamed") so the admin can act (NDC-1669 §10; Zoho Failure Log shows the record and the reason).',
    actual: 'Two full UUIDs in the sentence; same text in ' + c('GET /failures') + ' ' + c('last_error') + '.',
    records: 'Failures of 18 Oct (Desk ' + c('183dc191') + ', ' + c('db172f38') + '); 20 Oct Desk ' + c('62f23a7f') + ' (QA, discarded)',
    taviImg: 'shots/H10-failure-log.png', taviCaption: 'Failure Log reasons with raw ids', taviBoxes: [{ n: 1, x: 488, y: 362, w: 950, h: 40 }, { n: 2, x: 488, y: 508, w: 950, h: 40 }],
    zohoCaption: 'Zoho Failure Log (docs)', zohoText: ['Failure Log: "Pick a record type to see failure time and reason, with Try Again per record."', 'NDC-1669 §10: failure reasons are human-readable.'], zohoSources: [S1],
    rows: [{ n: '1–2', b: 'Failure reason text', zoho: 'Record + readable reason', tavi: 'Raw UUIDs of both records', match: 'Differs' }] },

  { id: 'CD-04', case: 'C17', sev: 'Medium', area: 'Field mapping', slug: 'invalid-mappings-saved',
    title: 'The settings API saves invalid field mappings',
    summary: 'The mapping editor validates its rows, but ' + c('PUT /desk/integrations/crm/config') + ' accepts a mapping to a CRM field that does not exist, to a Desk field that does not exist, a lookup field, and a row with an empty CRM field — all 200. Other checks (direction, enums, read-only target, one-way pair) are refused correctly with 422 ' + c('CRM_SYNC_MAPPING_INVALID') + '.',
    steps: ['GET the config, add one contact mapping row, PUT with the fresh row_version:', c('{crm_field:"no_such_field_qa", desk_field:"description"}') + ' / ' + c('{crm_field:"description", desk_field:"no_such_field_qa"}') + ' / ' + c('{crm_field:"account_id", desk_field:"description"}') + ' / ' + c('{crm_field:"", desk_field:"description"}') + '.'],
    expected: '422 with the matching codes the UI already knows: crm_field_unknown, desk_field_unknown, lookup_not_mappable, incomplete ("Pick a CRM field or clear this mapping.").',
    actual: '200 for all four; the row is stored (restored right after by the test).',
    records: 'row_version 39604617 → 39604830 (20 Oct 15:10 UTC), restored from the baseline',
    taviCaption: '4 invalid bodies accepted, 6 refused',
    blocks: [{ head: 'PUT /desk/integrations/crm/config (owner, fresh row_version) — one change each', lines: [
      { t: 'contacts.mappings += {crm_field:"no_such_field_qa", desk_field:"description"}  -> 200', box: 'accepted' },
      { t: 'contacts.mappings += {crm_field:"description", desk_field:"no_such_field_qa"}  -> 200', box: 'accepted' },
      { t: 'contacts.mappings += {crm_field:"account_id" (lookup), desk_field:"description"}  -> 200', box: 'accepted' },
      { t: 'contacts.mappings += {crm_field:"", desk_field:"description"}  -> 200', box: 'accepted' },
      'duplicate desk field / read-only desk field / one-way pair with two-way rows / direction=5 / on_crm_delete="maybe"  -> 422 CRM_SYNC_MAPPING_INVALID (correct)'] }],
    zohoCaption: 'Expected validation', zohoText: ['Zoho maps fields through dropdowns of existing fields only; no free-form field keys can be saved.', 'TAVI\'s own error codes for these cases exist in the app: crm_field_unknown, desk_field_unknown, lookup_not_mappable, incomplete.'], zohoSources: [S1],
    rows: [{ n: '1', b: 'Unknown CRM / Desk field', zoho: 'Not possible', tavi: 'Saved (200)', match: 'Differs' }, { n: '2', b: 'Lookup field / empty row', zoho: 'Not possible', tavi: 'Saved (200)', match: 'Differs' }] },

  { id: 'CD-05', case: 'F5', sev: 'Medium', area: 'Save / concurrency', slug: 'save-without-row-version',
    title: 'Settings are saved without a row_version, so the lost-update check can be skipped',
    summary: 'A stale ' + c('row_version') + ' is refused with 409 (correct), but a PUT that simply leaves ' + c('row_version') + ' out is accepted and overwrites whatever another admin saved in between.',
    steps: ['GET /desk/integrations/crm/config.', 'PUT the same body without the ' + c('row_version') + ' key (one harmless change).'],
    expected: '400/409/428: the version is required, like the stale case ("Another administrator saved these settings while you were editing…").',
    actual: '200, change stored, row_version moved.',
    records: '20 Oct, restored right after',
    taviCaption: 'Stale version refused, missing version accepted',
    blocks: [{ head: 'PUT /desk/integrations/crm/config', lines: ['with an old row_version  -> 409 CONFLICT (correct)', { t: 'without row_version  -> 200, saved', box: 'no version check' }] }],
    zohoCaption: 'Expected', zohoText: ['TAVI shows a conflict message for stale saves; the same protection must hold when the version is missing (spec F5).'], zohoSources: [],
    rows: [{ n: '1', b: 'Save without row_version', zoho: '—', tavi: 'Accepted', match: 'Not comparable' }] },

  { id: 'CD-06', case: 'H3', sev: 'Medium', area: 'Sync History', slug: 'history-no-failed-count',
    title: 'Sync History has no "failed" count',
    summary: 'Each Sync History row has only Added and Updated. Failed records are missing even when the Failure Log has entries for that day.',
    steps: ['Have at least one failed sync on a day (Failure Log not empty).', 'Desk → Settings → CRM ⇄ Desk Integration → Sync History (API ' + c('GET /history?days=7') + ').'],
    expected: 'Per day, direction and record type: added, updated and failed counts (Zoho docs; NDC-1669 §10).',
    actual: 'Rows ' + c('{date, direction, module, added, updated}') + ' only.',
    records: '19 Oct (2 failures in the log) and 20 Oct (1 failure, G19)',
    taviCaption: 'History rows have no failed count',
    blocks: [{ head: 'GET /desk/integrations/crm/history?days=1&tz=UTC (20 Oct, Failure Log had a new entry that day)', lines: [
      '{"date":"2026-10-20","direction":"desk_to_crm","module":"contacts","added":3,"updated":3}',
      '{"date":"2026-10-20","direction":"crm_to_desk","module":"contacts","added":9,"updated":10}',
      { t: 'no "failed" field in any row', box: 'missing' }] }],
    zohoCaption: 'Zoho Sync History (docs)', zohoText: ['"Sync History … Last 7 days: date, source -> target, record type (Contacts/Accounts), and added / updated / failed counts."'], zohoSources: [S1],
    rows: [{ n: '1', b: 'Failed count per row', zoho: 'Shown', tavi: 'Missing', match: 'Differs' }] },

  { id: 'CD-07', case: 'B11', sev: 'Low', area: 'Connection', slug: 'no-initial-sync-notice',
    title: 'No notice to the admin when the initial sync finishes',
    summary: 'After Connect, the initial customer and contract imports ran and finished, but the admin got no bell entry or other notice that the sync was complete.',
    steps: ['Desk → Settings → CRM ⇄ Desk Integration → Disconnect, then Connect.', 'Wait for the initial imports (Sync History / runs).', 'Check the admin\'s notifications.'],
    expected: 'The admin is told when the initial sync is done (NDC-1669 §4).',
    actual: 'Runs ' + c('initial_customers') + ' and ' + c('initial_contracts') + ' finished within seconds; no notification since the connect.',
    records: 'Connect at 2026-10-20 15:32:54 UTC (approved reconnect)',
    taviCaption: 'Imports finished, no notice',
    blocks: [{ head: 'After Connect (20 Oct 15:32 UTC)', lines: ['POST /desk/integrations/crm/connect (from the screen) -> "Integration connected."', 'runs: initial_customers partially_completed, initial_contracts partially_completed (finished)', { t: 'GET /notifications (owner) since connect -> []', box: 'no notice' }] }],
    zohoCaption: 'NDC-1669 §4', zohoText: ['Initial sync "may take several hours depending on volume" (Zoho docs).', 'NDC-1669 §4: the admin is notified when the initial sync finishes.'], zohoSources: [S1],
    rows: [{ n: '1', b: 'Notice when the initial sync is done', zoho: 'Required (PRD)', tavi: 'None', match: 'Differs' }] },

  { id: 'CD-08', case: 'I16', sev: 'Low', area: 'Desk contacts list', slug: 'raw-sync-status-labels',
    title: 'Desk contact list shows raw sync values "synced" / "needs_attention"',
    summary: 'Under each contact name the list shows the raw values ' + c('synced') + ' and ' + c('needs_attention') + '. The app already has the labels "Synced" and "Needs attention" (used on the contact page).',
    steps: ['Desk → Customers → All Contacts.'],
    expected: 'Labels "Synced" / "Needs attention" / "Unlinked" (TAVI\'s own strings, as on the contact page).',
    actual: 'Raw snake_case values.',
    records: 'Seen 19 and 20 Oct',
    taviImg: 'shots/I16-contact-list.png', taviCaption: 'Raw values in the list; label on the record', taviBoxes: [{ n: 1, x: 190, y: 143, w: 82, h: 28 }, { n: 2, x: 141, y: 504, w: 131, h: 28 }, { n: 3, x: 868, y: 101, w: 66, h: 22 }],
    zohoCaption: 'Not comparable', zohoText: ['Zoho shows no sync status in the contact list.', 'Expected from TAVI\'s own strings (locale crm-desk-integration): syncStatus.synced = "Synced", syncStatus.needs_attention = "Needs attention".'], zohoSources: [],
    rows: [{ n: '1–2', b: 'Status in the list', zoho: '—', tavi: 'synced / needs_attention', match: 'Not comparable' }, { n: '3', b: 'Status on the record', zoho: '—', tavi: '"Synced" (correct)', match: 'Not comparable' }] },

  { id: 'CD-09', case: 'B4', sev: 'Low', area: 'Pause', slug: 'long-pause-reason-500',
    title: 'Pause with a long reason fails with a server error',
    summary: 'A pause reason of 1,206 characters returns HTTP 500 "An unexpected error occurred." instead of a validation message.',
    steps: [c('POST /desk/integrations/crm/pause') + ' with ' + c('{reason: "QA CD " + 1200×"x"}') + '.'],
    expected: '400 with the maximum length (and the UI limits the field).',
    actual: '500 INTERNAL; integration not paused.',
    records: '20 Oct 15:12 UTC',
    taviCaption: '1,206-char reason -> 500',
    blocks: [{ head: 'POST /desk/integrations/crm/pause', lines: [{ t: '{reason: 1206 characters} -> 500 INTERNAL "An unexpected error occurred."', box: 'server error' }, '{reason: "QA CD pause … <b>x</b>"} -> 200, stored as text (correct)'] }],
    zohoCaption: 'Expected', zohoText: ['Input too long is a validation error (400) with the limit, never a 500.'], zohoSources: [],
    rows: [{ n: '1', b: 'Over-long pause reason', zoho: '—', tavi: '500', match: 'Not comparable' }] },

  { id: 'CD-10', case: 'O3', sev: 'Low', area: 'API', slug: 'stats-missing-record-200',
    title: 'Customer statistics answer 200 for a contact that does not exist',
    summary: c('GET /desk/integrations/crm/customers/contact/{random id}/stats') + ' answers 200 with zero counts. The other record endpoints answer 404 for unknown ids.',
    steps: ['GET the stats endpoint with a random UUID.'],
    expected: '404 for a record that does not exist.',
    actual: '200 with all counts 0.',
    records: '19 Oct (Run 1)',
    taviCaption: 'Random id -> 200 zeros',
    blocks: [{ head: 'GET /desk/integrations/crm/customers/contact/{random uuid}/stats?months=6', lines: [{ t: '200 {"total":0,"open":0,"on_hold":0,"closed":0,…}', box: 'should be 404' }, 'GET /context/contact/{random uuid}/info -> 404 (correct)'] }],
    zohoCaption: 'Expected', zohoText: ['Unknown records answer 404, as the other integration endpoints do.'], zohoSources: [],
    rows: [{ n: '1', b: 'Stats of an unknown contact', zoho: '—', tavi: '200 zeros', match: 'Not comparable' }] },
  { id: "CD-11", case: "G18", sev: "Medium", area: "Sync", slug: "mandatory-field-skipped",
    title: "Sync creates a Desk contact without its mandatory Last name",
    summary: "The Desk contact layout requires Last name. A CRM contact without a Last name is still copied to Desk, and the Desk contact is stored with Last name empty. Zoho reports a \"Mandatory field missing\" failure instead, so required fields stay valid.",
    steps: ["Desk contact layout: Last name is required (it is on staging).", "Create a CRM contact with First name and Email only.", "Wait for the sync; open the Desk contact."],
    expected: "The record fails with a readable \"mandatory field missing\" reason in the Failure Log (Zoho), or Desk fills a placeholder the admin chose. A required field is never left empty.",
    actual: "Desk contact created with " + c("last_name = null") + "; no failure.",
    records: "CRM " + c("e3109613") + " → Desk " + c("2562f0bf") + " (21 Oct, deleted after the run)",
    taviCaption: "Required Last name left empty",
    blocks: [{ head: "Desk contact layout bcac166e (Standard): required = [last_name]", lines: ["POST /modules/{crm contacts}/records {first_name: \"QA CD G18 …\", email} -> 201", { t: "Desk contact 2562f0bf created: last_name = null", box: "required field empty" }, "GET /failures -> no entry for the record"] }],
    zohoCaption: "Zoho Failure Log (docs)", zohoText: ["Documented failure reasons include \"Mandatory field missing\": mandatory fields must be mapped or the sync fails."], zohoSources: [S1],
    rows: [{ n: "1", b: "CRM contact without the Desk-required field", zoho: "Fails: Mandatory field missing", tavi: "Created with the field empty", match: "Differs" }] },

  { id: "CD-12", case: "K4", sev: "Medium", area: "Handshake Mode", slug: "handshake-ignores-phone",
    title: "Handshake Mode does not match requesters by phone",
    summary: "A ticket whose requester matches a CRM contact only by phone is put in New (not in CRM). NDC-1669 §8 requires phone matching, and Zoho classifies by CRM email or phone.",
    steps: ["Create a CRM contact with a phone and no email.", "Pause the sync so it is not linked by email. Create a Desk contact with the same phone and a ticket for it.", "Classify the ticket (Handshake Mode / " + c("POST /tickets/classify") + ")."],
    expected: "Contacts/Leads, matched by phone (NDC-1669 §8 AC; Zoho: \"Classification uses the CRM email or phone\").",
    actual: c("not_in_crm") + " (New), both for a ticket with only the phone and for the Desk contact with that phone.",
    records: "21 Oct, QA records deleted after the run",
    taviCaption: "Phone match ignored",
    blocks: [{ head: "CRM contact QA CD K4 (phone P, no email)", lines: ["ticket with phone P, no requester -> classify -> not_in_crm", { t: "ticket of an unlinked Desk contact with phone P (sync paused) -> not_in_crm", box: "should be Contacts/Leads" }] }],
    zohoCaption: "Zoho work modes (docs) + NDC-1669", zohoText: ["Handshake columns: Contacts/Leads, Customers, Potentials, New. \"Classification uses the CRM email or phone.\"", "NDC-1669 §8 AC: a requester matched by phone is classified correctly."], zohoSources: [S8],
    rows: [{ n: "1", b: "Requester known in CRM only by phone", zoho: "Contacts/Leads", tavi: "New", match: "Differs" }] },
  { id: 'CD-13', case: 'E8', sev: 'Medium', area: 'Delete preferences', slug: 'delete-preference-retroactive',
    title: 'Changing the delete preference applies to a delete made earlier',
    summary: 'A CRM contact is deleted while "Keep the Desk contact and flag its link" is set. If the preference is changed to "Delete the corresponding Desk contact" before that delete has synced, the Desk contact is deleted. NDC-1669 §5 requires preference changes not to be retroactive. Reproduced twice (21 Oct).',
    steps: ['Settings → Preferences: "On deleting a CRM contact" = Keep (default).', 'Pause sync (or have a busy queue). Delete a linked QA CRM contact.', 'Change the preference to "Delete the corresponding Desk contact" and save.', 'Resume; wait 45 s; open the Desk contact.'],
    expected: 'The delete keeps the preference in force when it happened (Keep): the Desk contact stays, its link flagged. NDC-1669 §5 AC: not retroactive.',
    actual: 'The Desk contact is deleted under the new preference.',
    records: 'QA CD E8 contacts (21 Oct, two runs), deleted after the runs',
    taviCaption: 'Delete made under Keep, applied as Delete',
    blocks: [{ head: 'on_crm_delete = keep', lines: ['POST /pause -> 200', 'DELETE CRM contact (QA CD E8) -> 204', 'PUT /config on_crm_delete = delete -> 200', 'POST /resume -> 200', { t: 'after 45 s: Desk contact gone', box: 'new preference applied to an old delete' }] }],
    zohoCaption: 'NDC-1669 §5', zohoText: ['NDC-1669 §5 AC: changing the delete preference is not retroactive — earlier deletes are not re-applied.'], zohoSources: [S1],
    rows: [{ n: '1', b: 'Delete made under Keep, preference changed before it synced', zoho: 'Keep applies', tavi: 'Delete applied', match: 'Differs' }] },

  { id: 'CD-14', case: 'E9 / E4', sev: 'High', area: 'Delete preferences', slug: 'cross-delete-not-in-recycle-bin',
    title: 'A Desk contact deleted by the integration is not in the recycle bin and cannot be restored',
    summary: 'With "Delete the corresponding Desk contact", deleting the CRM contact removes the Desk contact (GET answers 404), but the Desk contact is not in the Desk recycle bin. TAVI\'s own setting note says: "The Desk contact goes to the Desk recycle bin together with … its tickets … and can be restored from there." Data deleted this way cannot be restored.',
    steps: ['Settings → Preferences: "On deleting a CRM contact" = Delete the corresponding Desk contact.', 'Delete a linked QA CRM contact.', 'Desk → Settings → Recycle Bin (API ' + c('GET /audit/recycle-bin/items?app_key=desk') + '): look for the Desk contact.'],
    expected: 'The Desk contact (and its tickets) is in the Desk recycle bin and can be restored, as the setting promises (Zoho: "the record and its associates go to the Desk recycle bin").',
    actual: 'Desk contact 404; no recycle-bin entry for it (200 newest Desk items checked); restore impossible.',
    records: 'Desk contacts ' + c('94ce79a7') + ', ' + c('9fc88446') + ' (21 Oct)',
    taviCaption: 'Deleted by the integration, missing from the bin',
    blocks: [{ head: 'on_crm_delete = delete', lines: ['DELETE CRM contact (QA CD E9) -> 204', 'GET Desk contact 9fc88446 -> 404', { t: 'GET /audit/recycle-bin/items?limit=200&app_key=desk -> no entry for 9fc88446', box: 'not restorable' }, 'Setting note: "The Desk contact goes to the Desk recycle bin … and can be restored from there."'] }],
    zohoCaption: 'Zoho delete preference (docs)', zohoText: ['"Always delete in Desk: the record and its associates go to the Desk recycle bin."'], zohoSources: [S1],
    rows: [{ n: '1', b: 'Desk contact deleted through the integration', zoho: 'In the recycle bin, restorable', tavi: 'Gone, not in the bin', match: 'Differs' }] },

  { id: 'CD-15', case: 'J4', sev: 'Low', area: 'Profile permissions', slug: 'no-access-pane-loading',
    title: 'With "No access" the CRM pane is still offered and hangs on "Loading…"',
    summary: 'An agent whose profile has No access to CRM contact data still sees the CRM rail icon and the "CRM Contact Info" pane; the pane stays on "Loading…" because the data calls are refused (403). No CRM data leaks, but NDC-1669 §6 says no CRM pane is shown.',
    steps: ['Desk → CRM ⇄ Desk Integration → Permissions: Desk Agent → Contacts = No access.', 'Sign in as an agent with that profile; open a ticket of a linked contact.'],
    expected: 'No CRM pane or rail icon (NDC-1669 §6 AC), or a clear "Your profile cannot open this tab." state.',
    actual: 'Pane offered; spinner "Loading…" never ends.',
    records: 'Ticket #298 as fedelav803 (21 Oct); profile access restored after the check',
    taviImg: 'shots/J4-agent-no-access.png', taviCaption: 'Agent with No access: pane stuck on Loading…', taviBoxes: [{ n: 1, x: 365, y: 58, w: 295, h: 210 }],
    zohoCaption: 'Zoho + NDC-1669', zohoText: ['Zoho: unchecking "Visible" hides the CRM integration from the profile.', 'NDC-1669 §6 AC: an agent without access sees no CRM pane.'], zohoSources: [S1],
    rows: [{ n: '1', b: 'Agent with No access opens a linked ticket', zoho: 'No CRM pane', tavi: 'Pane stuck on Loading…', match: 'Differs' }] },

  { id: 'CD-16', case: 'I18', sev: 'Low', area: 'CRM pane', slug: 'pane-error-no-retry',
    title: 'The CRM pane error has no Retry',
    summary: 'When the pane\'s CRM data cannot be loaded, it shows "Could not load this section." but offers no Retry; the agent has to reload the whole ticket. The app already has the "Retry" string.',
    steps: ['Block or fail the pane\'s ' + c('/desk/integrations/crm/context/…') + ' calls (DevTools → block request URL).', 'Open a ticket of a linked contact and the CRM pane.'],
    expected: '"Could not load this section." with a Retry button (spec I18).',
    actual: 'Message only; no Retry.',
    records: 'Ticket #298 (21 Oct)',
    taviImg: 'shots/I18-no-retry.png', taviCaption: 'Error without Retry', taviBoxes: [{ n: 1, x: 383, y: 124, w: 262, h: 46 }],
    zohoCaption: 'Expected', zohoText: ['A failed section offers Retry (spec I18; the app has common.retry = "Retry").'], zohoSources: [],
    rows: [{ n: '1', b: 'Pane data fails to load', zoho: '—', tavi: 'Message, no Retry', match: 'Not comparable' }] },

  { id: 'CD-17', case: 'F8', sev: 'Low', area: 'Audit', slug: 'no-audit-for-settings',
    title: 'Integration settings changes are not in the Audit Log',
    summary: 'Many integration settings changes were saved on 20–21 Oct (pause, mappings, delete preferences, permissions, connect/disconnect), but the tenant Audit Log has no entry about the integration.',
    steps: ['Save any change on Desk → CRM ⇄ Desk Integration (e.g. a delete preference).', 'Open the tenant Audit Log (API ' + c('GET /audit/events') + ').'],
    expected: 'Who changed which integration setting and when (spec F8).',
    actual: 'Events exist for other areas; none for the integration.',
    records: '21 Oct, 100 newest events checked',
    taviCaption: 'No integration events',
    blocks: [{ head: 'GET /audit/events?limit=100 (21 Oct, after the settings changes)', lines: ['200, events from other modules (e.g. actor mahmoud.mahamed1515, source rest_api)', { t: 'no event mentioning the integration', box: 'not audited' }] }],
    zohoCaption: 'Expected', zohoText: ['Settings changes that affect every agent are audited (spec F8).'], zohoSources: [],
    rows: [{ n: '1', b: 'Integration settings change', zoho: '—', tavi: 'Not in the Audit Log', match: 'Not comparable' }] },
  { id: 'CD-18', case: 'D6', sev: 'Medium', area: 'Contracts', slug: 'contract-lock-not-enforced',
    title: '"Lock CRM-owned fields on the contract" does not stop edits in Desk',
    summary: 'With the lock on (the default), the contract name — which comes from the CRM deal name — can be changed in Desk and is saved. The next deal update then overwrites or conflicts with it. The setting exists precisely to stop that.',
    steps: ['Configuration → Contracts: "Lock CRM-owned fields on the contract" = on (default).', 'Win a QA deal so a Desk contract is created; give the contract a support plan, account and dates so it is valid.', 'Change the contract name in Desk (API ' + c('PATCH /modules/{desk contracts}/records/{id}') + ' {contract_name}).'],
    expected: 'CRM-owned contract fields (contract name, value, owner, description, start date) are read-only in Desk while the lock is on: refused with a clear message.',
    actual: '200; the contract name is changed in Desk. With the lock off the edit also works (same result).',
    records: 'Contract ' + c('3e021f5c') + ' of a QA deal (21 Oct, deleted after the run)',
    taviCaption: 'Locked field edited in Desk',
    blocks: [{ head: 'contracts.lock_crm_owned_fields = true; contract mapped from a won QA deal', lines: ['PATCH contract {support_plan, account_id, start_date, end_date} -> 200 (complete, valid)', { t: 'PATCH contract {contract_name: "QA CD edited in Desk"} -> 200, saved', box: 'lock not enforced' }, 'lock off: PATCH {contract_name} -> 200 (same as with the lock)'] }],
    zohoCaption: 'TAVI setting (TAVI extra)', zohoText: ['TAVI setting: "Lock CRM-owned fields on the contract" (on by default). Zoho has no contracts-from-deals feature, so the expected behaviour is the setting\'s own promise.'], zohoSources: [],
    rows: [{ n: '1', b: 'Edit a CRM-owned contract field in Desk, lock on', zoho: '— (TAVI extra)', tavi: 'Accepted', match: 'Not comparable' }] },
];

// ---------- images ----------
for (const b of bugs) {
  let taviPanel;
  if (b.blocks) {
    const shot = { out: `${b.id}-api.png`, title: `${b.id} · ${b.case} · TAVI request/response (staging, 19–20 Oct 2026)`, blocks: b.blocks };
    fs.writeFileSync(path.join(HERE, `${b.id}-api.json`), JSON.stringify(shot, null, 1));
    execFileSync('node', [path.join(HERE, 'make-api-shot.js'), path.join(HERE, `${b.id}-api.json`)], { stdio: 'inherit' });
    taviPanel = { side: 'TAVI', caption: b.taviCaption, img: `${b.id}-api.png` };
  } else taviPanel = { side: 'TAVI', caption: b.taviCaption, img: b.taviImg, boxes: b.taviBoxes };
  const zohoPanel = b.zohoImg ? { side: 'Zoho', caption: b.zohoCaption, img: b.zohoImg }
    : { side: 'Zoho', caption: b.zohoCaption, text: b.zohoText, sources: b.zohoSources, flag: b.zohoSources.length ? 'ZOHO DOCS / PRD — not seen on screen' : 'EXPECTED BEHAVIOUR — not a Zoho screen' };
  const cfg = { out: `../${b.id}-${b.slug}-vs-zoho.png`, id: `${b.id} (${b.case})`, title: b.title, subtitle: 'TAVI CRM / Desk (staging, tenant NDC-Staging) vs ' + (b.zohoImg ? 'live Zoho Desk taviportal + Zoho CRM (read-only)' : (b.zohoSources.length ? 'Zoho help docs / NDC-1669' : 'the expected behaviour')), verdict: 'Differs', date: '20 Oct 2026', panels: [taviPanel, zohoPanel], rows: b.rows, notes: [] };
  fs.writeFileSync(path.join(HERE, `${b.id}.json`), JSON.stringify(cfg, null, 1));
  execFileSync('node', [path.join(HERE, 'make-evidence.js'), path.join(HERE, `${b.id}.json`)], { stdio: 'inherit' });
  b.img = `${b.id}-${b.slug}-vs-zoho.png`;
}

// ---------- bug-report.html ----------
const prev = fs.readFileSync(path.resolve(HERE, '../../../execu_2026-10-18_crm-automation-order/bug-report.html'), 'utf8');
const style = prev.slice(prev.indexOf('<link rel="preconnect"'), prev.indexOf('</style>') + 8);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sevClass = s => (s === 'High' ? 'bug' : s === 'Medium' ? 'warn' : 'info');
const entry = b => `
    <article class="bug-entry" id="${b.id}">
      <div class="bug-head">
        <span class="bug-id">${esc(b.id)} · ${esc(b.case)}</span>
        <span class="pill ${sevClass(b.sev)}">${esc(b.sev)} (suggested)</span>
        <span class="pill info">${esc(b.area)}</span>
      </div>
      <h3>${esc(b.title)}</h3>
      <p>${b.summary}</p>
      <p class="steps-h"><strong>Steps to reproduce</strong></p>
      <ol class="steps">${b.steps.map(s => `\n        <li>${s}</li>`).join('')}
      </ol>
      <dl class="facts">
        <dt>Expected</dt><dd>${b.expected}</dd>
        <dt>Actual (TAVI)</dt><dd>${b.actual}</dd>
        <dt>Records</dt><dd>${b.records}</dd>
      </dl>
      <figure><img src="evidence/${b.img}" alt="${esc(b.id)}: TAVI next to Zoho / expected behaviour" loading="lazy"><figcaption>${esc(b.id)}: TAVI (left) vs Zoho or the expected behaviour (right).</figcaption></figure>
    </article>`;
const run = JSON.parse(fs.readFileSync(path.resolve(HERE, '../../results.json'), 'utf8'));
const html = `<title>CRM Desk Integration Bugs</title>
${style}

<div class="wrap">
  <header>
    <span class="eyebrow">TAVI CRM ⇄ Desk · QA run · 19–20 Oct 2026</span>
    <h1>CRM ⇄ Desk Integration: bugs found by executing the spec</h1>
    <p>Results of executing spec-crm-desk-integration.md on staging (Run 1 read-only 19 Oct, Run 2 writes and Run 3 connection 20 Oct, approved by the user). Expected behaviour = Zoho CRM + Desk and NDC-1669 (user decision: match Zoho). Only confirmed bugs are listed; the 9 missing features are in docs/crm-desk-integration/missing-report.html. Nothing here is filed in Plane.</p>
    <div class="meta">
      <span><b>Hosts</b> staging-crm / staging-desk.taviportal.com (tenant NDC-Staging)</span>
      <span><b>Accounts</b> Owner (integrated user), Desk Agent fedelav803</span>
      <span><b>Method</b> Selenium + API (Java, TestNG), automation feature crmdeskintegration</span>
      <span><b>Result</b> ${esc(run.headline)}</span>
    </div>
    <div class="tally">
      <span class="pill bug">${bugs.filter(b => b.sev === 'High').length} high</span>
      <span class="pill warn">${bugs.filter(b => b.sev === 'Medium').length} medium</span>
      <span class="pill info">${bugs.filter(b => b.sev === 'Low').length} low</span>
      <span class="pill ok">Gaps Z1–Z7, Z4, Z9 confirmed (missing report)</span>
    </div>
  </header>

  <section aria-labelledby="bugs">
    <h2 id="bugs">Confirmed bugs</h2>
    <p class="lead">Each bug was seen through the API and, where it has a screen, on the screen. Test records were prefixed "QA CD" and deleted after the run; the settings were restored from the baseline and checked field by field.</p>
${bugs.map(entry).join('\n')}
  </section>

  <section aria-labelledby="not-bugs">
    <h2 id="not-bugs">Not filed as bugs</h2>
    <ul class="plain">${run.notBugs.map(s => `<li>${s}</li>`).join('')}</ul>
  </section>

  <footer>
    <span>${esc(run.cleanup)}</span>
    <span>Every row with its verdict: report.md in this folder.</span>
  </footer>
</div>
`;
fs.writeFileSync(path.resolve(HERE, '../../bug-report.html'), html);
console.log('wrote bug-report.html', bugs.length, 'bugs');
