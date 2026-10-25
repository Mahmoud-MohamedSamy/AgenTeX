// Read-only: state, retest comment and attachments for every ticket of the round. Token read from the CSV, never printed.
const fs = require('fs');
const rows = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const API = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': TOKEN };
const ST = { '11f2d31f-9d01-4463-a1de-ce99521b97aa': 'Done', '34a7f4b6-7207-4955-b927-0d8d1dd3c666': 'Bug', 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1': 'Ready For Test' };
const ONLY = process.argv.slice(3); const T = [...require('../results.json').tickets].filter(t => !ONLY.length || ONLY.includes(t.id));
const get = async p => { for (let i = 0; i < 3; i++) { const r = await fetch(API + p, { headers: H }); if (r.status === 429) { await new Promise(s => setTimeout(s, 15000)); continue; } return r.json(); } };
(async () => { const bad = []; let n = 0;
  for (const t of T) {
    const w = await get(`/work-items/${t.uuid}/`); const c = await get(`/work-items/${t.uuid}/comments/`); const a = await get(`/work-items/${t.uuid}/attachments/`);
    const comments = (c.results || c || []).filter(x => /Retest (PASS|FAIL|PARTIAL) — 25 Oct 2026/.test(x.comment_html || x.comment_stripped || ''));
    const atts = (Array.isArray(a) ? a : a.results || []).filter(x => x.is_uploaded !== false).map(x => x.attributes?.name || x.name);
    const want = (t.v === 'PASS' ? 'Done' : 'Bug'); const st = ST[w.state] || w.state;
    const hasImg = t.img.every(i => atts.includes(i));
    const ok = st === want && comments.length >= 1 && hasImg; if (ok) n++;
    console.log(`${t.id.padEnd(9)} ${t.v.padEnd(7)} state=${st.padEnd(5)} retestComments=${comments.length} image=${hasImg ? 'yes' : 'NO'} ${ok ? 'OK' : '<-- CHECK'}`);
    if (!ok) bad.push(t.id);
  }
  console.log(`\n${n}/${T.length} complete; problems: ${bad.join(', ') || 'none'}`);
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
