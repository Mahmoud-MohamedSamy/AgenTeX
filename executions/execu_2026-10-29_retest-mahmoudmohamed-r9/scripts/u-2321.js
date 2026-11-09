// NDC-2321 (ticket steps): import ONE QA lead into Leads (Standard) with "Assign owner based on assignment rules" ticked (QA RT 2321 AR → U1).
await page.goto(H + '/modules/' + T.LEADS + '/import', { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('input[type=file]', { timeout: 150000, state: 'attached' }); await sleep(3000);
const so = await page.$('button:has-text("Start over")'); if (so) { await so.click(); await sleep(3000); }
await (await page.$('input[type=file]')).setInputFiles({ name: 'qa-rt-2321.csv', mimeType: 'text/csv', buffer: Buffer.from('First Name,Last Name,Phone\nQA RT 2321 lead imp,QA RT 2321 lead imp,01000023210\n') });
await sleep(5000); await page.click('button:has-text("Next")'); await sleep(6000);
await page.getByLabel('Target layout').selectOption({ label: 'Standard' }).catch(() => {}); await sleep(800);
await page.click('button:has-text("Next"), button:has-text("Save & next")'); await sleep(6000);
await page.click('button:has-text("Next"), button:has-text("Save & next")'); await sleep(6000);
await page.getByLabel('Assign owner based on assignment rules').check().catch(() => page.click('text=Assign owner based on assignment rules')); await sleep(2500);
const out = {}; await page.click('text=Choose assignment rule'); await sleep(1500); out.ruleOptions = await page.$$eval('[role=option], [role=listbox] li, [role=menuitem]', o => o.map(x => x.innerText.trim()).slice(0, 10)); await page.locator('[role=option], [role=listbox] li, [role=menuitem]', { hasText: /QA RT 2321 AR/ }).first().click(); await sleep(1000);
await page.getByLabel('Trigger automation and process management').check().catch(() => page.click('text=Trigger automation and process management')); const rule = null;
if (rule) { const opts = await rule.$$eval('option', o => o.map(x => x.textContent.trim())); out.ruleOptions = opts.slice(0, 10); const o = opts.find(x => /QA RT 2321 AR/.test(x)); if (o) await rule.selectOption({ label: o }); }
await sleep(1000); await shot('2321-1-assign.png');
await page.click('button:has-text("Save & next")'); await sleep(6000);
const rv = await text(); out.review = (rv.match(/Assign[^\n]{0,120}/g) || []).slice(0, 3);
await page.click('text=I confirm I have permission').catch(() => {}); await sleep(800);
await page.click('button:has-text("Submit")'); await sleep(20000); await shot('2321-2-result.png');
out.result = ((await text()).match(/Import complete.{0,120}/s) || [''])[0].replace(/\s+/g, ' ');
return out;
