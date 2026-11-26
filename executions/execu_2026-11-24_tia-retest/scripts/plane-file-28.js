// Files retest drafts 12–16 to Plane (NDC), adds module + Sprint 17, attaches annotated images, posts 4 comments.
// The API key is read from the newest Downloads secret-key CSV and never printed.
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads';
const kf = fs.readdirSync(DL).filter(f => /^secret-key-\d+\.csv$/.test(f)).sort().pop();
const KEY = fs.readFileSync(path.join(DL, kf), 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/docs/tia-assistant/';
const IMG = D + 'report/img/';
const { bugs, comments } = require(D + 'retest-drafts.js');
const STATE = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', LABEL = 'f251a7db-63d3-4635-b5fb-d3ce7325afc5', CYCLE = '8347595f-5728-4093-bb08-f451e7faa47b';
const ASSIGN = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', '551ac2bc-0cd1-4d42-9ac7-f037dd708e00'];
const MOD = { CRM: 'dea98455-e533-4b49-8a48-6fb88f3249a3', Desk: '274a73de-564a-4b8c-8b51-74fe8304e7c2', Omnichannel: 'a4262c39-aa66-4547-8335-beea17ecef76' };
const IDS = { 'NDC-3244': 'c809b6f1-cd81-4e11-bc74-a4c7ddf78a4b', 'NDC-3245': 'd6d6c206-2993-4901-b611-9f77af272cae', 'NDC-3246': '9bffa380-043d-4323-8792-c189b7b334c2', 'NDC-3254': '10995ba6-612c-4e5c-bd3c-2d8f9e0da81b' };
const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'NDC-Staging (staging-crm / staging-desk / staging-omnichannel.taviportal.com), 25 Nov 2026, Tia chat API (the same calls the Tia panel makes), Owner account.';
const req = async (m, p, body) => { const r = await fetch(B + p, { method: m, headers: H, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (x) {} return { s: r.status, j, t: t.slice(0, 300) }; };
const attach = async (id, file) => {
  const buf = fs.readFileSync(file), name = path.basename(file);
  const c = await req('POST', `/work-items/${id}/attachments/`, { name, type: 'image/png', size: buf.length }); if (c.s >= 300) return 'create ' + c.s;
  const up = c.j.upload_data, fd = new FormData(); for (const [k, v] of Object.entries(up.fields || {})) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), name);
  const u = await fetch(up.url, { method: 'POST', body: fd }); if (!u.ok && u.status !== 204) return 'upload ' + u.status;
  const aid = c.j.asset_id || (c.j.attachment && c.j.attachment.id); const p = await req('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true }); return p.s;
};
(async () => {
  const out = { key: kf.replace(/\d+/, '…'), created: [], comments: [] };
  // duplicate check by exact title among recent items
  const ex = await req('GET', '/work-items/?per_page=100&order_by=-created_at'); const titles = new Set((ex.j?.results || []).map(x => x.name));
  for (const b of bugs.filter(x => x.n >= 28 && !x.plane)) {
    if (titles.has(b.title)) { out.created.push({ n: b.n, skipped: 'already exists' }); continue; }
    const html = `<p><strong>Summary</strong></p><p>${e(b.expected)}</p><p><strong>Steps to reproduce</strong></p><ol>${b.steps.map(s => `<li><p>${e(s)}</p></li>`).join('')}</ol><p><strong>Expected result</strong></p><p>${e(b.expected)}</p><p><strong>Actual result</strong></p><p>${e(b.actual)}</p>${b.more.length ? `<ul>${b.more.map(m => `<li><p>${e(m)}</p></li>`).join('')}</ul>` : ''}<p><strong>Account</strong></p><p>${e(b.account)}</p><p><strong>Test cases</strong></p><p>${e(b.cases)} (Tia create/update/delete test, 25 Nov 2026; QA items were removed afterwards).</p><p><strong>Environment</strong></p><p>${ENV}</p>`;
    const c = await req('POST', '/work-items/', { name: b.title, description_html: html, priority: b.pri.toLowerCase(), state: STATE, assignees: ASSIGN, labels: [LABEL], start_date: '2026-11-25' });
    if (c.s >= 300) { out.created.push({ n: b.n, err: c.s + ' ' + c.t }); continue; }
    const id = c.j.id, seq = c.j.sequence_id; const row = { n: b.n, ndc: 'NDC-' + seq, id };
    const mods = b.app.split(' + ').map(a => MOD[a]).filter(Boolean);
    row.modules = []; for (const m of mods) { const r = await req('POST', `/modules/${m}/module-issues/`, { issues: [id] }); row.modules.push(r.s); }
    const cy = await req('POST', `/cycles/${CYCLE}/cycle-issues/`, { issues: [id] }); row.cycle = cy.s;
    row.att = []; for (const [f] of (b.images || [])) row.att.push(await attach(id, IMG + f));
    out.created.push(row);
  }
  for (const c of []) {
    const id = IDS[c.ticket]; let html = c.text.map(t => `<p>${e(t)}</p>`).join('');
    if (c.images) html += `<p>Annotated screenshot attached to this ticket: ${c.images.map(i => e(i[0])).join(', ')}.</p>`;
    const r = await req('POST', `/work-items/${id}/comments/`, { comment_html: html });
    const row = { ticket: c.ticket, s: r.s }; if (c.images) { row.att = []; for (const [f] of c.images) row.att.push(await attach(id, IMG + f)); }
    out.comments.push(row);
  }
  fs.writeFileSync(path.join(__dirname, '../out/plane-filed-28-34.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
})().catch(x => { console.error('ERR', x.message); process.exit(1); });
