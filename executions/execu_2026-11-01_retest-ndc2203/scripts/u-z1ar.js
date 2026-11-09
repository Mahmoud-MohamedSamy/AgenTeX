// NDC-2203 fix 1 on screen (admin, not on CES; rule "QA WF Z1" Create → Assign to team CES is active):
// New Ticket form, subject "QA WF Z1 form …", Save ONCE → message, where the form goes, how many POSTs. LANG = en | ar.
const LANG = 'ar'; const SUBJ = 'QA WF Z1 form ' + LANG + ' ' + String(Date.now()).slice(-5);
const resp = []; page.on('response', async r => { const q = r.request(); if (q.method() === 'POST' && /\/modules\/[^/]+\/records$/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 160); } catch (e) { } resp.push({ s: r.status(), b }); } });
await page.goto(H + '/hq', { waitUntil: 'domcontentloaded', timeout: 150000 }); await sleep(8000); await page.getByRole('button', { name: /^EN$/ }).first().click(); await sleep(1200); await page.locator('[role=menuitem], [role=option], button', { hasText: /العربية|Arabic/ }).first().click(); await sleep(4000);
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'domcontentloaded', timeout: 150000 });
await sleep(12000); await shot('z1-ar-0-form.png');
await page.getByText('Select department…', { exact: true }).first().click(); await sleep(1200);
await page.locator('[role=option]', { hasText: 'Customer Support' }).first().click(); await sleep(1500);
await page.locator('input[type=email]').first().fill('mmohamed@anyware.software');
await page.getByPlaceholder(/subject/i).first().fill(SUBJ); await page.keyboard.press('Escape'); await sleep(500);
const lab = await page.getByText(/^[\s*]*Status[\s*]*$/).first().boundingBox({ timeout: 8000 }).catch(() => null);
if (lab) { const cands = page.locator('button, [role=combobox]'); const cn = await cands.count();
  for (let i = 0; i < cn; i++) { const bb = await cands.nth(i).boundingBox().catch(() => null); if (bb && Math.abs((bb.y + bb.height / 2) - (lab.y + lab.height / 2)) < 20 && bb.x > lab.x && bb.x - lab.x < 250) { await cands.nth(i).click(); await sleep(900); await page.locator('[role=option]', { hasText: /^Open$/ }).first().click().catch(() => {}); break; } } }
await sleep(800); await shot('z1-' + LANG + '-1-filled.png');
const urlBefore = page.url();
await page.getByRole('button', { name: /^(Save|حفظ)$/ }).first().click({ force: true });
let toast = ''; for (let i = 0; i < 20 && !toast; i++) { await sleep(500); toast = ((await text()).match(/(Record saved[^\n]{0,80}|Permission denied[^\n]{0,20}|تم حفظ السجل[^\n]{0,80})/) || [''])[0]; }
await shot('z1-' + LANG + '-2-toast.png'); await sleep(5000); await shot('z1-' + LANG + '-3-after.png');
return { subject: SUBJ, toast, posts: resp, urlBefore, urlAfter: page.url(), formStillOpen: /\/records\/new/.test(page.url()) };
