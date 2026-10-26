// Writes the API evidence cards for round 4 Desk tickets (25–26 Oct 2026), renders them with apicard.js
// and stores the row boxes in cards/boxes-desk.json (used by specs-r4-desk.js). Usage: node cards-r4-desk.js
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const DESK = 'staging-desk.taviportal.com', BOTH = 'staging-desk.taviportal.com + staging-crm.taviportal.com';
const I = '/api/v1/desk/integrations/crm';
const DATE = '25–26 Oct 2026';
const C = {
  'NDC-2220-api.png': { host: DESK, who: 'mahmoud.mahamed1515 + mahmoud.mmohamedsamy', title: 'NDC-2220 · Create Module with Module Permission = Desk Agent only', rows: [
    ['create (dialog)', 'POST /api/v1/teamspaces/a641f1df…/modules  "QA RT Agents Only"', '201 — module 01727195…', 'ok'],
    ['permission (dialog)', 'PUT /api/v1/modules/01727195…/permissions {profileIds:[…402 Desk Agent]}', '200 (was 404) — toast "Module permissions updated successfully"; ACL access_mode "selected"', 'ok'],
    ['other user: records', 'mahmoud.mmohamedsamy (Desk Administrator + Supervisor) GET /modules/01727195…/records', '403 — not allowed', 'ok'],
    ['other user: UI', '"+" create menu and sidebar', 'Ticket, Contact, Account, Task, Call, Event, Contract — QA RT Agent Only not listed; not in sidebar', 'ok'],
    ['INFO', 'mahmoud.mmohamedsamy GET /api/v1/modules', 'still returns the module metadata (no records)', 'info']] },
  'NDC-2233-api.png': { host: DESK, title: 'NDC-2233 · upload restrictions on the API (QA RT Agents Only)', rows: [
    ['fields', 'qa_rt_file file_upload [pdf] 1 MB · qa_rt_img image_upload [png] 1 MB', 'inputs carry accept=".pdf" / ".png"', 'info'],
    ['wrong type', 'POST /modules/01727195…/records  qa_rt_file = .txt', '422 "File type is not allowed; allowed types: pdf."', 'ok'],
    ['too large', 'POST /modules/01727195…/records  qa_rt_file = 2.2 MB pdf', '422 "File upload exceeds maximum size of 1 MB."', 'ok'],
    ['note', 'file value shape', 'value now uses filename / size_bytes keys', 'info']] },
  'NDC-2246-api.png': { host: DESK, title: 'NDC-2246 · custom data type used to create a field, then delete while in use', rows: [
    ['create type', 'POST /api/v1/custom-datatypes {key:"qa_rt_dt4", base_datatype_key:"single_line"}', '201 — listed in GET /fields/datatypes', 'ok'],
    ['create field', 'POST /modules/{QA RT Agents Only}/fields  qa_rt_cdt datatypeKey "qa_rt_dt4"', '201 (was 400 DATATYPE_KEY_UNKNOWN)', 'ok'],
    ['stored field', 'GET field qa_rt_cdt', 'datatypeKey "single_line" + datatypeOptions.custom_datatype_key "qa_rt_dt4" — custom type kept as a reference', 'ok'],
    ['delete in use (J4)', 'DELETE /api/v1/custom-datatypes/qa_rt_dt4', '409 DATATYPE_IN_USE "Datatype is in use by at least one field draft."', 'ok']] },
  'NDC-2250-api.png': { host: DESK, title: 'NDC-2250 · GET /api/v1/modules — lastModifiedByName', rows: [
    ['Tickets', 'GET /api/v1/modules', 'lastModifiedByName "ndc-staging-owner" — list shows "NS ndc-staging-owner 19/10/2026"', 'ok'],
    ['seeded modules', 'Contacts, Accounts, Products, Calls, Events, Tasks, Contracts, Time Entries', 'created and last changed by the system → "System 06/09/2026"', 'ok'],
    ['new module', 'QA RT Agents Only (created in this run)', 'lastModifiedByName "mahmoud.mahamed1515"', 'ok']] },
  'NDC-2393-api.png': { host: BOTH, title: 'NDC-2393 · unlink a contact pair, change it in CRM, then link again', rows: [
    ['unlink', `DELETE ${I}/links/61f4a99c…`, '204', 'ok'],
    ['CRM change', 'PATCH /api/v1/modules/{crm contacts}/records/d9a7b0fa… {title:"QA RT after unlink"}', '200', 'info'],
    ['after 50 s', `GET ${I}/links?kind=contact · Desk contact f0de6428…`, 'no link for the pair (not re-linked); Desk Title still empty (not synced)', 'ok'],
    ['manual link', `POST ${I}/links {kind:"contact", crm_record_id, desk_record_id}`, '201 — link f2e7a3dd (was 409 "already linked")', 'ok']] },
  'NDC-2396-api.png': { host: DESK, title: 'NDC-2396 · PUT /config with invalid contact mappings (fresh row_version each time)', rows: [
    ['unknown CRM field', `PUT ${I}/config  contacts.mappings += {crm_field:"no_such_field_qa", desk_field:"description"}`, '422 crm_field_unknown', 'ok'],
    ['unknown Desk field', `PUT ${I}/config  += {crm_field:"description", desk_field:"no_such_field_qa"}`, '422 desk_field_unknown', 'ok'],
    ['empty CRM field', `PUT ${I}/config  += {crm_field:"", desk_field:"description"}`, '422 incomplete', 'ok'],
    ['lookup field', `PUT ${I}/config  += {crm_field:"account_id", desk_field:"description"}`, '422 — refused, but reason desk_field_unknown (expected lookup_not_mappable)', 'info'],
    ['stored config', `GET ${I}/config`, 'nothing stored from the four cases', 'ok']] },
  'NDC-2397-api.png': { host: DESK, title: 'NDC-2397 · PUT /config without row_version', rows: [
    ['no row_version', `PUT ${I}/config (harmless change, row_version key removed)`, '400 ""row_version" is required: send the row_version these settings were read at, so a save never overwrites another administrator\'s changes." (was 200)', 'ok'],
    ['stored config', `GET ${I}/config`, 'config after the round diffed equal to integration-baseline.json (except row_version)', 'ok']] },
  'NDC-2398-api.png': { host: DESK, title: 'NDC-2398 · Sync History rows now carry a failed count', rows: [
    ['history', `GET ${I}/history?days=7`, 'rows {date, direction, module, added, updated, failed}', 'ok'],
    ['example row', '2026-10-25 · desk_to_crm · accounts', 'added 1 · updated 0 · failed 1', 'ok']] },
  'NDC-2399-api.png': { host: DESK, title: 'NDC-2399 · initial-sync notice — NOT RUN (blocked)', rows: [
    ['needed', 'Settings › CRM ⇄ Desk Integration › Disconnect, then Connect', 'triggers the initial imports and the "initial sync finished" notice', 'info'],
    ['why not run', 'the integration is shared by the whole staging tenant', 'approval for this round covered pause / resume / settings only — a disconnect + connect was not approved', 'bad'],
    ['state', 'integration status after the round', 'enabled, not paused; config diffed equal to integration-baseline.json', 'info'],
    ['next step', 'ask at Gate 2', 'run Disconnect + Connect once approved, then check bell / email for added / updated / ignored counts', 'info']] },
  'NDC-2401-api.png': { host: DESK, title: 'NDC-2401 · pause with a long reason', rows: [
    ['1206 characters', `POST ${I}/pause {reason: 1206 chars}`, '400 VALIDATION_ERROR "The pause reason can be at most 500 characters." (was 500 INTERNAL)', 'ok'],
    ['state', 'integration status after the call', 'not paused', 'ok']] },
  'NDC-2402-api.png': { host: DESK, title: 'NDC-2402 · customer statistics for a contact that does not exist', rows: [
    ['stats', `GET ${I}/customers/contact/{random uuid}/stats?months=6`, '404 (was 200 {"total":0,…})', 'ok'],
    ['control', `GET ${I}/context/contact/{random uuid}/info`, '404', 'ok']] },
  'NDC-2403-api.png': { host: BOTH, who: 'CRM test user 1 + mahmoud.mahamed1515', title: 'NDC-2403 · CRM contact without Last name (mandatory in Desk)', rows: [
    ['CRM create', 'POST CRM contacts "QA RT 2403" (first name + email only)', '201 — 14318a6e…', 'info'],
    ['after 45 s', `Desk contacts by email · GET ${I}/failures`, 'no Desk contact created; failure "Mandatory field missing: Last Name is required in Desk, but the CRM record has no value for it. Fill it in CRM, or map another CRM field to it."', 'ok'],
    ['control', 'CRM contact "QA RT 2393 Pair" (with last name) d9a7b0fa…', 'Desk contact f0de6428 created; link synced', 'ok']] },
  'NDC-2404-api.png': { host: BOTH, who: 'CRM test user 1 + mahmoud.mahamed1515', title: 'NDC-2404 · Handshake classification by phone', rows: [
    ['CRM contact', 'POST CRM contacts "QA RT 2404 Phone" phone +201005552404, no email', '201 — 860c468b…', 'info'],
    ['while paused', `POST ${I}/pause · Desk contact "QA RT 2404 desk" (same phone) + ticket fd913c6d · phone-only ticket 6fbde867 · resume`, '200 / 201 / 201 / 200', 'info'],
    ['after 50 s', `POST ${I}/tickets/classify [fd913c6d, 6fbde867]`, 'both crm_contact_or_lead (was not_in_crm)', 'ok']] },
  'NDC-2405-api.png': { host: BOTH, who: 'CRM test user 1 + mahmoud.mahamed1515', title: 'NDC-2405 · delete preference is not applied retroactively', rows: [
    ['preference', `GET ${I}/config  on_crm_delete`, '"keep"', 'info'],
    ['delete while paused', `POST ${I}/pause · DELETE CRM contact d9a7b0fa…`, '200 · 204', 'info'],
    ['change preference', `PUT ${I}/config  on_crm_delete = "delete"`, '200', 'info'],
    ['resume, after 50 s', `POST ${I}/resume · GET Desk contact f0de6428…`, 'Desk contact still there (not deleted); link needs_attention', 'ok'],
    ['restore', `PUT ${I}/config  on_crm_delete = "keep"`, '200 — config equal to the backup', 'info']] },
  'NDC-2409-api.png': { host: DESK, title: 'NDC-2409 · audit event for an integration settings save', rows: [
    ['save', `PUT ${I}/config (one change, fresh row_version)`, '200', 'info'],
    ['event', 'GET /api/v1/audit/events', 'actor mahmoud.mahamed1515 · time 00:57 · entity "CRM ⇄ Desk integration settings" · action config.updated', 'ok'],
    ['UI text', 'Setup › Audit Log', '"… updated CRM ⇄ Desk integration settings\' action from blank value to config.updated" — raw value, setting not named', 'bad']] },
};
const dir = path.join(__dirname, 'cards'); fs.mkdirSync(dir, { recursive: true });
const boxes = {};
for (const [out, s] of Object.entries(C)) {
  const f = path.join(dir, out.replace('.png', '.json'));
  fs.writeFileSync(f, JSON.stringify({ out, date: DATE, ...s }, null, 1));
  const o = execFileSync('node', [path.join(__dirname, 'apicard.js'), f], { encoding: 'utf8' }).trim();
  boxes[out] = JSON.parse(o.slice(o.indexOf('[')));
  console.log(o);
}
fs.writeFileSync(path.join(dir, 'boxes-desk.json'), JSON.stringify(boxes, null, 1));
