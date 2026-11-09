// D1 through the New Ticket form (Standard layout). Captures the create request/response.
const resp = []; page.on('response', async r => { const q = r.request(); if (q.method() === 'POST' && /\/modules\/[^/]+\/records$/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 400); } catch (e) {} resp.push({ s: r.status(), b }); } });
await go('/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', 10000);
await page.locator('select').first().selectOption('1b55c25d-eb27-4046-afd1-b292398b435b').catch(() => {}); await sleep(8000);
await page.getByText('Select department…', { exact: true }).first().click(); await sleep(1200);
const deptOpts = await page.locator('[role=option]').allInnerTexts();
await page.locator('[role=option]', { hasText: 'Customer Support' }).first().click().catch(() => {}); await sleep(1000);
await page.locator('input[type=email]').first().fill(QA_EMAIL);
await page.getByPlaceholder('Type or pick a subject').fill('QA WF D1 form owner ticket'); await page.keyboard.press('Escape'); await sleep(500);
const lab = await page.getByText(/^[\s*]*Status[\s*]*$/).first().boundingBox({ timeout: 8000 });
const cands = page.locator('button, [role=combobox], select'); const cn = await cands.count(); let stEl = null;
for (let i = 0; i < cn; i++) { const bb = await cands.nth(i).boundingBox().catch(() => null); if (bb && lab && Math.abs((bb.y + bb.height / 2) - (lab.y + lab.height / 2)) < 20 && bb.x > lab.x && bb.x - lab.x < 250) { stEl = cands.nth(i); break; } }
const stTag = stEl ? await stEl.evaluate(e => e.tagName) : 'none'; let stOpts = [];
if (stTag === 'SELECT') { stOpts = await stEl.locator('option').allInnerTexts(); await stEl.selectOption({ label: 'Open' }).catch(() => {}); }
else if (stEl) { await stEl.click(); await sleep(1000); stOpts = await page.locator('[role=option]').allInnerTexts(); await page.locator('[role=option]', { hasText: /^Open$/ }).first().click().catch(() => {}); }
await sleep(800);
const ownerBefore = await page.getByText('Ticket Owner', { exact: true }).locator('xpath=following::*[1]').innerText().catch(() => '?');
if (!/mahmoud/.test((await txt()).split('Ticket Owner')[1]?.slice(0, 60) || '')) { await page.getByText('Assign to user…', { exact: true }).first().click(); await sleep(1200); await page.locator('[role=option]', { hasText: 'mahmoud.mahamed1515' }).first().click().catch(() => {}); await sleep(800); }
const ownerSet = ((await txt()).split('Ticket Owner')[1] || '').slice(0, 60).split('\n').join(' ');
await shot('d1-form-3-filled-owner');
await page.getByRole('button', { name: 'Save', exact: true }).click({ force: true }); await sleep(9000);
await shot('d1-form-4-after-save-owner');
const after = (await txt()).split('\n').filter(l => /denied|permission|error|created|saved|QA WF D1|not /i.test(l)).slice(0, 12);
return done({ ownerSet, stTag, stOpts: stOpts.slice(0, 10), deptOpts: deptOpts.slice(0, 10), resp, url: page.url(), after });
