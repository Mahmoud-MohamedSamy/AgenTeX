const R = { calls: [] }; const F = process.env.KBFILE;
page.on('request', q => { if (/\/api\/v1\//.test(q.url()) && q.method() !== 'GET') R.calls.push(q.method() + ' ' + q.url().replace(/^.*\/api\/v1/, '') + ' ' + (q.postData() || '').slice(0, 160)); });
await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 120000 }).catch(() => {}); await sleep(2500);
await shot('P3-D02-page'); R.buttons = await page.locator('button').allInnerTexts().then(a => a.map(x => x.trim()).filter(Boolean).slice(0, 40)); await page.mouse.click(619, 274); await sleep(3500); await shot('P3-D02-after-edit'); R.dlg = (await page.locator('[role=dialog]').count());
await page.locator('[role=dialog] >> text=Knowledge Base').first().click({ force: true }); await sleep(2500);
await shot('P3-D02-kb-tab-before');
await page.locator('input[type=file]').first().setInputFiles(F); await sleep(12000);
R.after = (await page.locator('[role=dialog]').innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 600);
await shot('P3-D02-kb-uploaded');
const sd = page.getByRole('button', { name: /Save Draft/i }); if (await sd.count()) { await sd.click(); await sleep(5000); }
R.saved = (await text()).includes('not live') || (await text()).includes('Deploy');
return R;
