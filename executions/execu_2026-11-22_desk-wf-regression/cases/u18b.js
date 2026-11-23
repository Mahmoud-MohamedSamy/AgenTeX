const out = {}; const fs = require('fs'); const clean = s => (s || '').replace(/\s+/g, ' '); const RID = JSON.parse(fs.readFileSync('out/api01.json', 'utf8')).id;
const bodies = []; page.on('request', r => { if (r.method() === 'PATCH' && r.url().includes('/workflow/rules/' + RID)) { bodies.push(r.postData()); fs.writeFileSync('out/api01-bodies.json', JSON.stringify(bodies)); } });
const open = async () => { await page.goto(H + '/settings/automation/workflow-rules/' + RID, { waitUntil: 'domcontentloaded' }); await sleep(12000); if (await page.locator('input[type=password]').locator('visible=true').count()) throw new Error('session not valid'); };
// B: reopen, remove the conditions, save
await open(); await shot('U18-B-open');
const cond = page.locator('main').getByText(/Priority/).first(); if (await cond.count()) { await cond.click(); await sleep(1500); }
await shot('U18-B-expanded'); out.B_buttons = (await page.locator('main button').evaluateAll(b => b.map(x => (x.getAttribute('aria-label') || x.innerText || '').trim()).filter(Boolean))).filter(t => /remove|delete|trash|clear/i.test(t)).slice(0, 10);
let removed = 0; for (let k = 0; k < 4; k++) { const rm = page.locator('main button[aria-label="Remove condition"]').first(); if (!(await rm.count())) break; await rm.click(); removed++; await sleep(900); }
out.B_removed = removed; await shot('U18-B-removed'); out.B_canvas = clean(await page.locator('main').innerText()).match(/CONDITION.{0,160}/)?.[0];
const save = page.getByRole('button', { name: /^Save$/ }).first(); out.B_saveEnabled = await save.isEnabled().catch(() => 'n/a');
if (removed && out.B_saveEnabled === true) { await save.click(); await sleep(6000); }
out.B_requests = bodies.length; out.toast = clean((await page.locator('[data-sonner-toast], [role=status], [role=alert]').allInnerTexts().catch(() => [])).join(' | ')).slice(0, 200);
await shot('U18-B-saved'); const g=await page.evaluate(()=>0); return out;
