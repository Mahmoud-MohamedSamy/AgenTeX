// Builds the CRM ⇄ Desk retest evidence (27 Oct 2026): one API facts card per ticket (from after/cdi-api*.log facts only),
// then one annotated TAVI-vs-Zoho image per ticket. Zoho side = reference shots captured live on 18–21 Oct while the Zoho
// Desk ⇄ CRM integration existed (it was deleted afterwards), so Zoho behaviour is "as captured then", not re-checked today.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const S = path.resolve(__dirname, '..');
const T = [
  { t: 'NDC-2393', cd: 'CD-01', v: 'PASS', title: 'Unlink stops the sync; a manual re-link works', z: '10-crm-desk-settings', lines: [
    ['DELETE /desk/integrations/crm/links/{id}  -> 204 (unlink)', ''], ['CRM edit after the unlink -> Desk title stays "G4 from Desk", crm_sync_status = unlinked, link = none', 'ok'],
    ['GET candidates for the email -> 200, 1 row', ''], ['POST /links -> 201; link now synced, manual', 'ok']],
    rows: [['1', 'After Unlink, a CRM change does not re-link the pair', 'Not checked live (the Zoho integration was deleted); the capture shows the integration settings page only', 'The Desk record kept its own value and stayed unlinked; no automatic re-link by email', 'PASS'],
      ['2', 'Link the pair again by hand', 'Not checked live', 'POST /links answered 201 and the link is "manual", synced', 'PASS']] },
  { t: 'NDC-2395', cd: 'CD-03', v: 'PASS', title: 'Failure Log reasons name the records', z: '07-desk-failure-log', lines: [
    ['New failure today (G19): crm_record_already_linked', ''], ['"The CRM contacts record \\"QA CD G9 crm r95gl\\" with the same email is already paired with Desk record \\"QA CD G9 crm r95gl\\"." record_name=QA CD G9 desk A r95gl', 'ok'],
    ['ReadApiTest H10 still counts 6 of 21 older rows with raw ids — rows written before the fix keep their old text', 'info']],
    rows: [['1', 'Failure reason names the record', 'Failure Log page as captured; its reason wording was not compared', 'New failures show record names; only rows stored before the fix still show raw ids', 'PASS']] },
  { t: 'NDC-2396', cd: 'CD-04', v: 'PASS', title: 'Invalid field mappings are refused', z: '04-desk-configuration-details', lines: [
    ['PUT /desk/integrations/crm/config with 7 invalid mapping bodies:', ''], ['unknown CRM field -> 422 crm_field_unknown · unknown Desk field -> 422 desk_field_unknown', 'ok'],
    ['read-only Desk field -> 422 protected_target · lookup -> 422 · incomplete row -> 422 incomplete', 'ok'], ['duplicate target, one-way with two-way fields, bad direction / enum -> 422 / 400', 'ok'], ['accepted: []  (none saved)', 'ok']],
    rows: [['1', 'Saving an invalid mapping', 'Configuration Details page as captured; saving invalid mappings not checked live', 'Every invalid body is refused with a field-level reason; none was stored', 'PASS']] },
  { t: 'NDC-2397', cd: 'CD-05', v: 'PASS', title: 'Settings save needs the row_version', z: '04-desk-configuration-details', lines: [
    ['PUT config with a stale row_version -> 409 "The integration settings were changed by someone else. Reload and try again."', 'ok'],
    ['PUT config without row_version -> 400 "\\"row_version\\" is required …"', 'ok']],
    rows: [['1', 'Save without the version of the settings it was read at', 'Not checked live', 'Refused with 400 and a clear message; a stale version gets 409', 'PASS']] },
  { t: 'NDC-2398', cd: 'CD-06', v: 'PASS', title: 'Sync History has a failed count', z: '07-desk-sync-history', lines: [
    ['GET /desk/integrations/crm/history?days=1', ''], ['{"date":"2026-10-27","direction":"desk_to_crm","module":"accounts","added":4,"updated":0,"failed":5}', 'ok']],
    rows: [['1', 'Each Sync History row shows failed records', 'Sync History as captured shows "Added" counts per module; no failed row appears on that capture', 'Rows now carry a "failed" count', 'PASS']] },
  { t: 'NDC-2401', cd: 'CD-09', v: 'PASS', title: 'A long pause reason is refused with a clear message', z: '10-crm-desk-settings', lines: [
    ['POST pause with a 1,206-character reason', ''], ['-> 400 VALIDATION_ERROR "The pause reason can be at most 500 characters."  (was 500 on 20 Oct)', 'ok'], ['POST pause with a normal reason -> 200; status paused=true; resumed afterwards', 'info']],
    rows: [['1', 'Pause with a too-long reason', 'Not checked live', '400 with a clear limit message instead of a server error', 'PASS']] },
  { t: 'NDC-2402', cd: 'CD-10', v: 'PASS', title: 'Stats for a missing contact answer 404', z: '16-crm-contact-desk-related-list', lines: [
    ['ReadApiTest O3 (random ids) passed', 'ok'], ['GET contact stats for a deleted contact -> 404 NOT_FOUND "Record … was not found."', 'ok']],
    rows: [['1', 'Statistics for a contact that does not exist', 'Not checked live', '404 instead of 200 with zeros', 'PASS']] },
  { t: 'NDC-2405', cd: 'CD-13', v: 'PASS', title: 'A delete preference change does not apply to an earlier delete', z: '05-desk-delete-pref-crm-contact-options', lines: [
    ['CRM contact deleted while "Keep the Desk contact" was set; preference changed to "Delete" before it ran', ''], ['-> Desk contact kept = true', 'ok']],
    rows: [['1', 'Changing the delete preference after a delete', 'Delete preference options as captured; the timing case not checked live', 'The Desk contact was kept, as the earlier preference said', 'PASS']] },
  { t: 'NDC-2409', cd: 'CD-17', v: 'PASS', title: 'Integration settings changes are in the Audit Log', z: '10-crm-desk-settings', lines: [
    ['Settings changed by the tests (pause, mappings, delete preferences)', ''], ['GET /audit/events -> 200; entries mentioning the integration = true (actor: the owner, 27 Oct 07:06 and 07:35 UTC)', 'ok']],
    rows: [['1', 'Settings changes are audited', 'Not checked live', 'Audit entries for the integration settings changes, with the actor', 'PASS']] },
  { t: 'NDC-2392', cd: 'J1a / Z9', v: 'FAIL', title: 'Default CRM access is not admin-only (gap item 9)', z: '07-desk-permissions', lines: [
    ['ReadApiTest J1a: GET config profile_access', ''], ['No profile restrictions are stored: every Desk profile (agents, light agents …) has Full Access to CRM data', 'bad']],
    rows: [['1', 'Who can see CRM data in Desk by default', 'Permissions page as captured; the default access was not re-checked live (the 21 Oct gap list cites Zoho docs: admin only)', 'Every Desk profile has Full Access', 'FAIL']] },
];
for (const x of T) {
  const card = { out: `api-${x.t}.png`, title: `TAVI API — ${x.cd} retest, 27 Oct 2026 (crmdeskintegration automation, owner)`, lines: x.lines };
  fs.writeFileSync(path.join(S, 'scripts', `card-${x.t}.json`), JSON.stringify(card, null, 1));
  execFileSync('node', [path.join(S, 'scripts/apicard.js'), path.join(S, 'scripts', `card-${x.t}.json`)], { stdio: 'pipe' });
  const buf = fs.readFileSync(path.join(S, 'evidence/raw', card.out)); const h = buf.readUInt32BE(20);
  const spec = { out: `${x.t}-retest.png`, ticket: x.t, verdict: x.v, label: x.v === 'PASS' ? 'RETEST PASS' : 'STILL FAILS', title: `${x.cd} · ${x.title}`,
    env: 'staging-crm / staging-desk.taviportal.com (owner) vs Zoho Desk ⇄ CRM as captured live 18–21 Oct 2026 (that Zoho integration has since been deleted)', date: '27 Oct 2026',
    panels: [{ img: card.out, w: 1600, h, crop: [0, 0, 1600, h], caption: `TAVI — facts from the automated run of 27 Oct 2026 (${x.cd}).`, boxes: x.rows.map((r, i) => { const per = Math.ceil(x.lines.length / x.rows.length), y = k => 88 + k * ((h - 100) / x.lines.length); return { b: [8, Math.round(y(i * per)), 1592, Math.round(y(Math.min(x.lines.length, (i + 1) * per))) - 2], n: Number(r[0]) }; }) },
      { img: `z-${x.z}.png`, w: 1600, h: 950, crop: [0, 0, 1600, 950], caption: 'Zoho — reference screen captured 18–21 Oct 2026.', boxes: x.rows.filter(r => !/^'?Not checked live/.test(r[2])).map((r, i) => ({ b: [260 + i * 20, 70 + i * 20, 1590 - i * 20, 940 - i * 20], n: Number(r[0]), color: '#16a34a' })) }],
    rows: x.rows };
  fs.writeFileSync(path.join(S, 'scripts', `spec-${x.t}.json`), JSON.stringify(spec, null, 1));
  execFileSync('node', [path.join(S, 'scripts/annotate-vs-zoho.js'), path.join(S, 'scripts', `spec-${x.t}.json`)], { stdio: 'pipe' });
  console.log('built', x.t);
}
