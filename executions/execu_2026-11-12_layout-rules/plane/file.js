// Files Layout Rules findings in Plane (REST, API key never printed). Rerun-safe: skips keys already in out/plane-filed.json.
const fs = require('fs'), path = require('path');
const RUN = path.resolve(__dirname, '..'); const OUT = RUN + '/out/plane-filed.json'; const EV = RUN + '/evidence/';
const KEY = fs.readFileSync('D:/Learning & Work/Software Testing/Anyware Software/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const TODO = '508a727a-4eb2-4e7c-870a-cd40dce75c2c', ASG = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9529016b-e67d-42b9-815c-263f673b8252', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const L = { mf: 'b4793725-8568-4924-ae21-055387b991f2', acl: '23c31598-da4d-4b68-b0a7-40b8ff4aeb9b', kanban: 'c5c53970-001b-4bb1-bb52-29e453989f86', conv: '690eae1d-1f08-4197-bcab-569824799dac', a11y: '594b65cc-5f36-4c32-9071-4b0cb9dd336a' };
const MOD = { CRM: 'dea98455-e533-4b49-8a48-6fb88f3249a3', Desk: '274a73de-564a-4b8c-8b51-74fe8304e7c2' }; const CYCLE = '7143596a-fcfb-48b6-a6ee-193bfc04bfdd';
const done = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { items: {} }; const save = () => fs.writeFileSync(OUT, JSON.stringify(done, null, 1));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const src = fs.readFileSync(RUN + '/report/build.js', 'utf8');
const arrOf = n => { const i = src.indexOf('const ' + n + ' = ['); const j = src.indexOf('\n];', i); return eval(src.slice(src.indexOf('[', i), j + 3)); };
const bugs = arrOf('bugs');
const sentences = s => s.split(/(?<=\.)\s+(?=[A-Z"])/).filter(Boolean);
const hosts = apps => [/CRM/.test(apps) ? 'staging-crm.taviportal.com' : '', /Desk/.test(apps) ? 'staging-desk.taviportal.com' : ''].filter(Boolean).join(' and ');
const setup = apps => (/Desk/.test(apps) && !/CRM/.test(apps))
  ? 'Desk Tickets layout "QA LR1112 Layout" with test fields type, tier, filter (pick lists), order, note, reason (text), vip (checkbox), date and email2.'
  : 'Leads layout "QA LR1112 Layout" with test fields type (Refund, Question, Partner, Other), tier, filter (pick lists), order, note, reason (text), vip (checkbox), radio, date and email2' + (/Desk/.test(apps) ? '; the same setup on Desk Tickets.' : '.');
const bugHtml = b => {
  const [id, sev, apps, cases, title, steps, exp, act, ev] = b; const evs = (ev || '').split(' · ').filter(Boolean);
  const env = `<li>NDC-Staging (${hosts(apps)}), Chromium, 12 November 2026, admin account.</li><li>${esc(setup(apps))} Test data was deleted after the run.</li>`;
  const notes = [`Test cases ${cases.join(', ')} in the Layout Rules test sheet (https://claude.ai/artifact/PUdj9axtAjCR8UQpegu5qC).`,
    (/CRM/.test(apps) && /Desk/.test(apps)) ? 'CRM and Desk share the same rule engine, so this applies to both apps.' : '',
    evs.length ? `Evidence: ${evs.join(', ')} (attached).` : ''].filter(Boolean);
  return `<div><h2>Summary</h2><p>${esc(title)}. ${esc(sentences(act)[0])}</p><h2>Environment</h2><ul>${env}</ul><h2>Steps to reproduce</h2><ol>${sentences(steps).map(s => `<li>${esc(s)}</li>`).join('')}</ol><h2>Expected result</h2><p>${esc(exp)}</p><h2>Actual result</h2><ul>${sentences(act).map(s => `<li>${esc(s)}</li>`).join('')}</ul><h2>Notes</h2><ul>${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul></div>`;
};
const items = [];
for (const b of bugs) {
  const apps = b[2]; const mods = [/CRM/.test(apps) ? 'CRM' : '', /Desk/.test(apps) ? 'Desk' : ''].filter(Boolean);
  const labels = [L.mf]; if (b[0] === 'B-12') labels.push(L.acl); if (b[0] === 'B-19') labels.push(L.a11y);
  items.push({ key: b[0], name: 'Layout Rules | ' + b[4], priority: b[1].toLowerCase(), html: bugHtml(b), mods, labels, ev: (b[8] || '').split(' · ').filter(Boolean) });
}
const env1 = '<li>NDC-Staging (staging-crm.taviportal.com), Chromium, 12 November 2026, admin account.</li>';
items.push({ key: 'side-kanban', name: 'Kanban View | Kanban view of Leads and Deals does not load: every column shows "Could not load these records"', priority: 'high', mods: ['CRM'], labels: [L.kanban], ev: ['crm-kanban-leads.png', 'crm-kanban-deals.png'],
  html: `<div><h2>Summary</h2><p>The Kanban view does not load on Leads or Deals. Every column shows "Could not load these records" because the records request for each column fails with 500.</p><h2>Environment</h2><ul>${env1}<li>Leads (17 columns by Lead Status) and Deals (7 columns by Stage). Seen on 12 Nov in the morning and again in the afternoon.</li></ul><h2>Steps to reproduce</h2><ol><li>Open Leads.</li><li>Switch to the Kanban view.</li><li>Do the same on Deals.</li></ol><h2>Expected result</h2><p>Each column loads its records, as in Zoho CRM's Kanban view.</p><h2>Actual result</h2><ul><li>Every column shows "Could not load these records".</li><li>GET /modules/{id}/records?page=1&amp;per_page=25&amp;filters=[{"field":"lead_status","operator":"equals",...}] returns 500 INTERNAL_ERROR (the "is_empty" column too).</li><li>On Deals the same request with "pipeline" equals returns 500.</li></ul><h2>Notes</h2><ul><li>This blocks Layout Rules cases G8 and Z4 (rules on Kanban drag), so they could not be tested.</li><li>Evidence: crm-kanban-leads.png, crm-kanban-deals.png (attached).</li></ul></div>` });
items.push({ key: 'side-convert', name: 'Lead Conversion | Convert page shows no message when the server refuses the conversion', priority: 'medium', mods: ['CRM'], labels: [L.conv], ev: ['crm-G15-convert.png'],
  html: `<div><h2>Summary</h2><p>When the server refuses a lead conversion (422), the convert page shows no message. The user does not know why nothing happened.</p><h2>Environment</h2><ul>${env1}<li>A test lead converted with a new deal (Transaction).</li></ul><h2>Steps to reproduce</h2><ol><li>Open a lead and click Convert.</li><li>Choose to create a new deal and set the stage to Closed Lost. Leave amount, closing date and reason empty.</li><li>Click Convert.</li></ol><h2>Expected result</h2><p>The page shows the server's message (amount, closing date and reason are required), as Zoho CRM does on its convert page.</p><h2>Actual result</h2><ul><li>The request returns 422 (amount, closing date and reason required).</li><li>The page shows nothing and stays as it was.</li></ul><h2>Notes</h2><ul><li>Found while testing Layout Rules case G15.</li><li>Evidence: crm-G15-convert.png (attached).</li></ul></div>` });
items.push({ key: 'side-related', name: 'Layout Rules | "Show related lists" picker lists the same relation many times', priority: 'low', mods: ['CRM'], labels: [L.mf], ev: ['crm-F21-pick.png'],
  html: `<div><h2>Summary</h2><p>In the rule editor, the picker of the "Show related lists" action shows the same module relation many times and has no Notes entry.</p><h2>Environment</h2><ul>${env1}<li>Leads, rule editor.</li></ul><h2>Steps to reproduce</h2><ol><li>Open Settings &gt; Modules and Fields &gt; Leads &gt; Layout Rules and edit a rule.</li><li>Add the action "Show related lists" and open its picker.</li></ol><h2>Expected result</h2><p>Each related list appears once with a clear name. Zoho lists each related list once, including Notes.</p><h2>Actual result</h2><ul><li>Entries such as "Leads (Lookup 2)" and "Leads (Multi-Select Lookup)" appear up to 7 times.</li><li>There is no Notes entry.</li><li>Also, the Leads record page shows no related-list sections, so the effect of the action cannot be seen.</li></ul><h2>Notes</h2><ul><li>Found in Layout Rules case F21.</li><li>Evidence: crm-F21-pick.png (attached).</li></ul></div>` });
module.exports = { items, done, save, B, H, TODO, ASG, MOD, CYCLE, EV, L, esc };
if (require.main === module) (async () => {
  const only = process.argv[2];
  if (only === 'preview') { for (const it of items) console.log(it.key, '|', it.priority, '|', it.mods.join('+'), '|', it.name, '|', it.ev.map(f => f + (fs.existsSync(EV + f) ? '' : ' MISSING')).join(',')); console.log(items.find(i => i.key === 'B-09').html); return; }
  for (const it of items) {
    if (done.items[it.key]) continue; if (only && only !== 'all' && only !== it.key) continue;
    const r = await fetch(B + '/work-items/', { method: 'POST', headers: H, body: JSON.stringify({ name: it.name, description_html: it.html, priority: it.priority, state: TODO, assignees: ASG, labels: it.labels, start_date: '2026-11-12' }) });
    const j = await r.json(); if (!r.ok) { console.log('CREATE FAIL', it.key, r.status, JSON.stringify(j).slice(0, 300)); continue; }
    done.items[it.key] = { id: j.id, seq: 'NDC-' + j.sequence_id, mods: it.mods, att: [] }; save(); console.log(it.key, '->', 'NDC-' + j.sequence_id);
    for (const f of it.ev) {
      if (!fs.existsSync(EV + f)) { done.items[it.key].att.push(f + ' MISSING'); continue; } const buf = fs.readFileSync(EV + f);
      try {
        const c = await fetch(`${B}/work-items/${j.id}/attachments/`, { method: 'POST', headers: H, body: JSON.stringify({ name: f, type: 'image/png', size: buf.length }) }); const cj = await c.json(); if (!c.ok) throw new Error('create ' + c.status);
        const fd = new FormData(); for (const [k, v] of Object.entries(cj.upload_data.fields || {})) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), f);
        const u = await fetch(cj.upload_data.url, { method: 'POST', body: fd }); if (!u.ok && u.status !== 204) throw new Error('upload ' + u.status);
        const aid = cj.asset_id || (cj.attachment && cj.attachment.id); const p = await fetch(`${B}/work-items/${j.id}/attachments/${aid}/`, { method: 'PATCH', headers: H, body: JSON.stringify({ is_uploaded: true }) }); done.items[it.key].att.push(f + ' ' + p.status);
      } catch (e) { done.items[it.key].att.push(f + ' ERR ' + e.message); }
      save();
    }
  }
})();
