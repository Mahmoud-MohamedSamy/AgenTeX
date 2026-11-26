// Files the 26 Nov batch findings (credits, limits, access). Key read from Downloads CSV, never printed.
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads';
const kf = fs.readdirSync(DL).filter(f => /^secret-key-\d+\.csv$/.test(f)).sort().pop();
const KEY = fs.readFileSync(path.join(DL, kf), 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const STATE = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', LABEL = 'f251a7db-63d3-4635-b5fb-d3ce7325afc5', CYCLE = '8347595f-5728-4093-bb08-f451e7faa47b';
const ASSIGN = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', '551ac2bc-0cd1-4d42-9ac7-f037dd708e00'];
const MOD = { CRM: 'dea98455-e533-4b49-8a48-6fb88f3249a3', Desk: '274a73de-564a-4b8c-8b51-74fe8304e7c2', Omnichannel: 'a4262c39-aa66-4547-8335-beea17ecef76' };
const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'NDC-Staging (staging-crm.taviportal.com), Tia v15–v19 (same settings), Tia chat and settings API (the same calls the app makes), 26 Nov 2026. Every setting changed for the test was restored and checked afterwards; test records, layouts and chats were deleted.';
const req = async (m, p, body) => { const r = await fetch(B + p, { method: m, headers: H, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (x) {} return { s: r.status, j, t: t.slice(0, 300) }; };
const bugs = require("./bugs-p6.json");
(async () => {
  const out = []; const ex = await req('GET', '/work-items/?per_page=100&order_by=-created_at'); const titles = new Set((ex.j?.results || []).map(x => x.name));
  for (const b of bugs) {
    if (titles.has(b.title)) { out.push({ t: b.title.slice(0, 40), skipped: 'exists' }); continue; }
    const html = `<p><strong>Summary</strong></p><p>${e(b.summary)}</p><p><strong>Steps to reproduce</strong></p><ol>${b.steps.map(s => `<li><p>${e(s)}</p></li>`).join('')}</ol><p><strong>Expected result</strong></p><p>${e(b.expected)}</p><p><strong>Actual result</strong></p><p>${e(b.actual)}</p>${b.more.length ? `<ul>${b.more.map(m => `<li><p>${e(m)}</p></li>`).join('')}</ul>` : ''}<p><strong>Account</strong></p><p>Owner; CRM Manager test user; Desk test user.</p><p><strong>Environment</strong></p><p>${e(ENV)}</p>`;
    const c = await req('POST', '/work-items/', { name: b.title, description_html: html, priority: b.pri, state: STATE, assignees: ASSIGN, labels: [LABEL], start_date: '2026-11-26' });
    if (c.s >= 300) { out.push({ t: b.title.slice(0, 40), err: c.s + ' ' + c.t }); continue; }
    const id = c.j.id; const row = { ndc: 'NDC-' + c.j.sequence_id, t: b.title.slice(0, 50), mods: [] };
    for (const m of b.mods) row.mods.push((await req('POST', `/modules/${MOD[m]}/module-issues/`, { issues: [id] })).s);
    row.cycle = (await req('POST', `/cycles/${CYCLE}/cycle-issues/`, { issues: [id] })).s; out.push(row);
  }
  fs.writeFileSync(path.join(__dirname, '../out/plane-filed-p6.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1));
})().catch(x => { console.error('ERR', x.message); process.exit(1); });
