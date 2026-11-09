// NDC-2754 retest 7 Nov 2026: comment + state → Bug (QA lead decision). Usage: node post.js <token.csv> [--dry]. Token read by column, never printed.
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..');
const [csv, flag] = process.argv.slice(2); const DRY = flag === '--dry';
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3', WI = 'e5a3c57f-224c-4fbc-8d72-9abc5e52c8a7';
const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 6; i++) { let r; try { r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); } catch (e) { await new Promise(s => setTimeout(s, 8000)); continue; } if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs', 'NDC-2754.json'), 'utf8'));
const still = spec.rows.filter(r => r[4] === 'FAIL');
const html = `<p><strong>Retest PARTIAL — 7 Nov 2026</strong> → moved to Bug<br>Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge (headless) + API; admin + Desk Agent fedelav803<br>Method: API and screen</p>`
  + `<p>Both fixes from the 7 Nov note work: a Share to the ticket's own department is refused, and a Desk Agent who owns a step can open the ticket, run that step and loses access when the ticket moves on. One case is still open: a step owner without the share permission cannot run a step that requires a Share. Owning the step should be enough to complete it (QA lead decision), as the 7 Nov note also says.</p>`
  + `<p>Checked:</p><ul>${spec.rows.map(r => `<li>Item ${esc(r[0])}, ${esc(r[1])} → ${esc(r[3])} <strong>[${esc(r[4])}]</strong></li>`).join('')}</ul>`
  + (still.length ? `<p>Still failing:</p><ul>${still.map(r => `<li>Item ${esc(r[0])}, ${esc(r[1])}: expected ${esc(r[2])}, actual ${esc(r[3])}. Steps: blueprint with dynamic owners and a transition whose During list has a required Share; on an admin-owned ticket, Assign owners of that transition → a Desk Agent; as the agent, open the ticket and run the transition with a share to another department.</li>`).join('')}</ul>` : '')
  + `<p>Item 10 not run: Happiness Rating is off on NDC-Staging.</p><p>Evidence: ${esc(spec.out)} (attached)</p>`;
(async () => {
  fs.writeFileSync(path.join(RUN, 'plane-draft.html'), `<!doctype html><meta charset="utf-8"><title>Plane draft NDC-2754</title><body style="font:14px system-ui;max-width:1000px;margin:auto"><h3>NDC-2754 → Bug</h3>${html}</body>`);
  fs.writeFileSync(path.join(RUN, 'attach-map.json'), JSON.stringify({ dir: path.join(RUN, 'screenshots', 'annotated').split(path.sep).join('/'), files: { [spec.out]: WI } }, null, 1));
  const w = await call('GET', `/work-items/${WI}/`); if (w.j?.state !== RFT) { console.log('SKIPPED — not in Ready For Test (state ' + w.s + ')'); return; }
  if (DRY) { console.log('dry run: would comment + move to Bug'); return; }
  const c = await call('POST', `/work-items/${WI}/comments/`, { comment_html: html }); const s = await call('PATCH', `/work-items/${WI}/`, { state: BUG });
  console.log(`comment ${c.s} state→Bug ${s.s}`);
})().catch(e => console.log('ERR', String(e.message).replace(/plane_api_\w+/g, '<t>')));
