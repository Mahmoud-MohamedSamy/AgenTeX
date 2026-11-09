// Files the new bug (user asked 27 Oct 2026): custom field "pipeline" overrides the real pipeline. Then adds it to module CRM and attaches the evidence.
// Usage: node scripts/file-pipeline-bug.js <token.csv>. Token read by the "Secret key" column, never printed.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const csv = process.argv[2];
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 5; i++) { const r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const html = `<p><strong>Summary.</strong> On Deals, a <em>custom</em> pick-list field was created with the api name <code>pipeline</code> — the same key as the built-in Pipeline. Since then every deal write that sends a pipeline is validated against the custom field's allowed values instead of the module's pipelines, on every layout. Only "Standard (Standard)" passes, so no deal can be created on, or moved to, any pipeline other than the default.</p>
<h3>Steps to reproduce</h3><ol>
<li>Settings › Modules and Fields › Transactions (Deals) › Fields › search "Pipeline": a field <strong>Pipeline / pipeline / Pick list / Custom Field ✓ / layout Wonder Travel</strong> exists (created 24 Oct 2026 15:54 UTC by ndc-staging-owner, allowed values ["Standard (Standard)"]).</li>
<li>Transactions › Create, layout <strong>Standard</strong>, Pipeline = "1", fill the required fields › Save.</li>
<li>API: <code>POST /api/v1/modules/{Deals}/records</code> on layout Standard with <code>{"field":"pipeline","value":{"kind":"string","value":"640e03a4-9c24-4b06-8d7d-5c1db2711b9b"}}</code>.</li>
<li>Also: change a deal's pipeline (record page / Mass Update / PATCH).</li></ol>
<h3>Expected</h3><ul>
<li>A custom field cannot be created with the api name of a built-in field (Zoho reserves system api names; custom fields get their own name).</li>
<li>A deal's pipeline is validated against the module's pipelines; a field placed on one layout never changes validation on other layouts.</li></ul>
<h3>Actual</h3><ul>
<li>Step 2: "Pipeline: '640e03a4-9c24-4b06-8d7d-5c1db2711b9b' is not one of the allowed values (Standard (Standard))."</li>
<li>Step 3: 422 "Invalid value for: Pipeline."; without a pipeline (or with the text "Standard (Standard)") the deal lands on the default Standard pipeline.</li>
<li>Control: with the custom field's list widened temporarily to include the real pipeline ids, a deal is created on "1", an edit moves a deal to "1", and a stage not in "1" is refused — the pipeline logic works; the custom field is the cause. The field was restored to ["Standard (Standard)"] right after.</li></ul>
<h3>Impact</h3><p>All pipeline features are blocked on staging since 24 Oct. This is why NDC-1302, NDC-1312, NDC-1316 and NDC-1324 could not be verified in round 4 (moved to Bug). NDC-2382 passed on 26 Oct only with the list widened for the test.</p>
<h3>Suggested fix</h3><ol><li>Block custom api names that collide with system fields (validate on create/rename).</li><li>Validate a record value against its own field definition, never a same-named field from another layout.</li><li>Data: rename or remove the custom "pipeline" field on staging (owner: ndc-staging-owner) once the fix is in.</li></ol>
<p><strong>Environment:</strong> staging-crm.taviportal.com, tenant NDC-Staging, Edge + API, account mahmoud.mahamed1515 (CRM Admin), 25–27 Oct 2026. Deals module f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430, field 6b44c7c9-5c6b-4e7f-a33a-5fdbc43ec0ab, pipelines Standard 5170500c…, "1" 640e03a4….</p>
<p><strong>Evidence:</strong> NDC-new-pipeline-field-BUG.png (attached).</p>`;
(async () => {
  const c = await call('POST', '/work-items/', { name: 'Deals | A custom field named "pipeline" overrides the real Pipeline — deals are refused on every pipeline but the default', description_html: html, priority: 'high',
    state: '34a7f4b6-7207-4955-b927-0d8d1dd3c666', assignees: ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'], labels: ['3e9a50d6-a2d9-4bf2-a262-5b6a1f194caf', 'b4793725-8568-4924-ae21-055387b991f2'] });
  const id = c.j?.id; console.log('create', c.s, id ? 'NDC-' + c.j.sequence_id : JSON.stringify(c.j).slice(0, 200)); if (!id) return;
  const m = await call('POST', '/modules/dea98455-e533-4b49-8a48-6fb88f3249a3/module-issues/', { issues: [id] }); console.log('module CRM', m.s);
  fs.writeFileSync(path.join(__dirname, '..', 'attach-bug.json'), JSON.stringify({ dir: path.join(__dirname, '..', 'screenshots', 'annotated').replace(/\\/g, '/'), files: { 'NDC-new-pipeline-field-BUG.png': id } }));
  console.log(execFileSync('node', [path.join(process.env.USERPROFILE, '.claude/skills/retest-ready-tickets/scripts/plane-attach.js'), csv, 'ahmed-hegazy', PID, path.join(__dirname, '..', 'attach-bug.json')], { encoding: 'utf8' }).trim());
  fs.writeFileSync(path.join(__dirname, '..', 'new-bug.json'), JSON.stringify({ id, seq: c.j.sequence_id }));
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
