const fs = require('fs'), path = require('path');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' }; const DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa';
const call = async (m, p, b) => { for (let i = 0; i < 4; i++) { try { const r = await fetch(B + p, { method: m, headers: H, body: JSON.stringify(b) }); const t = await r.text(); if (r.status < 500) return { s: r.status, t }; } catch (e) { } await new Promise(s => setTimeout(s, 4000)); } return { s: 0 }; };
(async () => {
  const d = JSON.parse(fs.readFileSync(path.join(__dirname, '../plane-draft.json'), 'utf8'));
  for (const it of d.items.filter(x => x.verdict === 'PASS')) {
    const c = await call('POST', `/work-items/${it.workitem_id}/comments/`, { comment_html: it.comment_html });
    const s = await call('PATCH', `/work-items/${it.workitem_id}/`, { state: DONE });
    let st = ''; try { st = JSON.parse(s.t).state; } catch (e) { }
    console.log(it.ticket, 'comment', c.s, 'state', s.s, st === DONE ? 'Done' : st);
  }
})();
