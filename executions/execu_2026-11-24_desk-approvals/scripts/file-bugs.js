// Files bugs.js to Plane with the user's API key (never printed): create -> cycle -> module -> attach images.
// node scripts/file-bugs.js <key1,key2|all>   Results appended to out/filed.json (skips keys already filed).
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const RUN = path.resolve(__dirname, '..');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].trim();
const P = 'efce4d84-5876-4015-b472-2efca7ad73f3';
const B = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${P}`;
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', CYCLE = '8347595f-5728-4093-bb08-f451e7faa47b', DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const LABELS = { 'Approval Process': '5743f59d-c8ee-46db-8649-82fc8a584f5b', 'Blueprint': 'abdc5684-1c9c-46f3-b7ce-f7b7909b42fc', 'Web Forms': '113c8156-5066-4fdc-8f63-6c6f548507f7', 'Reports': '6373259c-6360-48f3-8bc7-9304e60681e4', 'Accessibility': '594b65cc-5f36-4c32-9071-4b0cb9dd336a', 'Localization': 'f4f62a22-62f8-4a31-b05c-8763d6e79e19', 'Notifications': 'ab31c0a1-f4dc-417e-8049-a9ce01060b8f', 'Access Control': '23c31598-da4d-4b68-b0a7-40b8ff4aeb9b' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const li = a => a.map(x => `<li><p>${esc(x)}</p></li>`).join('');
const html = b => `<h2>Summary</h2><p>${esc(b.summary)}</p><h2>Steps to Reproduce</h2><ol>${li(b.steps)}</ol><h2>Expected Result</h2><ul>${li(b.expected)}</ul><h2>Actual Result</h2><ul>${li(b.actual)}</ul>` +
  `<h2>Environment</h2><ul><li><p>App: Anyware Desk (staging), staging-desk.taviportal.com, tenant NDC-Staging</p></li><li><p>Accounts: ndc-staging-owner, Test User 1 (Desk Supervisor, requester), Customer Experience Specialists 2 (Desk Agent, approver), QA Team 1 (Desk Administrator)</p></li><li><p>Browser: Microsoft Edge (Chromium), Windows 10; API checks with the same accounts</p></li><li><p>Dates: 24–25 Nov 2026</p></li></ul>` +
  `<h2>Reference</h2><p>Found in the NDC-2871 (Approvals page) retest, cases ${esc(b.cases)}. Annotated evidence attached: ${esc(b.imgs.join(', '))}.</p>`;
const req = async (m, p, body) => { const r = await fetch(B + p, { method: m, headers: H, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { } return { s: r.status, j, t: t.slice(0, 300) }; };
(async () => {
  const bugs = require(path.join(RUN, 'bugs.js')); const want = process.argv[2] || '';
  const outF = path.join(RUN, 'out/filed.json'); const filed = fs.existsSync(outF) ? JSON.parse(fs.readFileSync(outF, 'utf8')) : {};
  for (const b of bugs) {
    if (want !== 'all' && !want.split(',').includes(b.key)) continue;
    if (filed[b.key]) { console.log('skip', b.key, filed[b.key].seq); continue; }
    const c = await req('POST', '/work-items/', { name: b.title, description_html: html(b), priority: b.priority, state: BUG, assignees: ASSIGNEES, labels: b.labels.map(l => LABELS[l]) });
    if (!c.j?.id) { console.log('CREATE FAIL', b.key, c.s, c.t); continue; }
    const id = c.j.id, seq = c.j.sequence_id; filed[b.key] = { id, seq }; fs.writeFileSync(outF, JSON.stringify(filed, null, 1));
    const cy = await req('POST', `/cycles/${CYCLE}/cycle-issues/`, { issues: [id] });
    const mo = await req('POST', `/modules/${DESK}/module-issues/`, { issues: [id] });
    const at = []; for (const img of b.imgs) { try { execFileSync('node', [path.join(__dirname, 'plane-attach.js'), id, path.join(RUN, 'evidence/annotated', img)], { stdio: 'pipe' }); at.push('ok'); } catch (e) { at.push('fail ' + String(e.stderr || e.message).slice(0, 120)); } }
    filed[b.key] = { id, seq, cycle: cy.s, module: mo.s, attach: at }; fs.writeFileSync(outF, JSON.stringify(filed, null, 1));
    console.log(`NDC-${seq}`, b.key, 'cycle', cy.s, 'module', mo.s, 'attach', at.join(','));
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
