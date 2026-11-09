// NDC-2624 explore: what "+ Upload" in the Files tab opens (nothing uploaded).
const L = 'e647a303-e5a7-46a0-b199-9ef1644ab3c0';
await page.goto(`${H}/modules/${T.LEADS}/records/${L}`, { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=QA RT 2624 timeline lead', { timeout: 120000 }); await sleep(3000);
await page.locator('text=/^Files$/').first().click(); await page.waitForSelector('text=ATTACHMENTS', { timeout: 30000 }); await sleep(2000);
const cands = await page.$$eval('button, a, label, [role=button]', els => els.filter(e => /upload/i.test(e.innerText || e.getAttribute('aria-label') || '')).map(e => ({ tag: e.tagName, t: (e.innerText || e.getAttribute('aria-label')).trim().slice(0, 30), x: Math.round(e.getBoundingClientRect().left), y: Math.round(e.getBoundingClientRect().top) })));
const u = page.getByText('+ Upload', { exact: false }).last(); await u.click().catch(e => log('click err ' + e.message.slice(0, 80))); await sleep(3000); await shot('2624-x-after-upload-click.png');
const inputs = await page.$$eval('input[type=file]', els => els.map(e => ({ accept: e.accept, multiple: e.multiple, vis: !!e.offsetParent, near: e.closest('[role=dialog], section, div')?.innerText?.slice(0, 60) })));
return { cands, inputs, dialog: await page.$$eval('[role=dialog]', d => d.map(x => x.innerText.slice(0, 300))) };
