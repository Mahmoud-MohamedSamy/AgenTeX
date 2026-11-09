// New Ticket form: owner = another agent (no rule involved). Captures create response, toast, and the owner picker options.
const resp = []; page.on('response', async r => { const q = r.request(); if (q.method() === 'POST' && /\/modules\/[^/]+\/records$/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 200); } catch (e) {} resp.push({ s: r.status(), b }); } });
await go('/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', 10000);
await page.locator('select').first().selectOption('1b55c25d-eb27-4046-afd1-b292398b435b').catch(() => {}); await sleep(8000);
await page.getByText('Select department…', { exact: true }).first().click(); await sleep(1200);
await page.locator('[role=option]', { hasText: 'Customer Support' }).first().click(); await sleep(1500);
await page.locator('input[type=email]').first().fill(QA_EMAIL);
await page.getByPlaceholder('Type or pick a subject').fill('QA WF Y6 form owner other'); await page.keyboard.press('Escape'); await sleep(500);
const lab = await page.getByText(/^[\s*]*Status[\s*]*$/).first().boundingBox({ timeout: 8000 });
const cands = page.locator('button, [role=combobox]'); const cn = await cands.count();
for (let i = 0; i < cn; i++) { const bb = await cands.nth(i).boundingBox().catch(() => null); if (bb && lab && Math.abs((bb.y + bb.height / 2) - (lab.y + lab.height / 2)) < 20 && bb.x > lab.x && bb.x - lab.x < 250) { await cands.nth(i).click(); await sleep(900); await page.locator('[role=option]', { hasText: /^Open$/ }).first().click(); break; } }
await sleep(600);
await page.getByText('Assign to user…', { exact: true }).first().click(); await sleep(1500);
const ownerOpts = await page.locator('[role=option]').allInnerTexts();
const inp = page.locator('[role=dialog] input, [role=listbox] input, input[placeholder*="earch"]').last(); if (await inp.count()) { await inp.fill('fedelav'); await sleep(1500); }
const ownerOpts2 = await page.locator('[role=option]').allInnerTexts();
await page.locator('[role=option]', { hasText: /fedelav/i }).first().click().catch(() => {}); await sleep(800);
await shot('i1-form-owner-other-filled');
await page.getByRole('button', { name: 'Save', exact: true }).click({ force: true }); await sleep(8000);
await shot('i1-form-owner-other-after');
return done({ ownerOpts: ownerOpts.slice(0, 8), ownerOpts2: ownerOpts2.slice(0, 8), resp, url: page.url(), toast: (await txt()).split('\n').filter(l => /denied|error|saved|created/i.test(l)).slice(0, 4) });
