// NDC-2294 item 2: import ONE QA lead with "Enable manual approval" ticked; the lead must wait for approval, not be created.
await page.goto(H + '/modules/' + T.LEADS + '/import', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000);
const input = await page.$('input[type=file]');
await input.setInputFiles({ name: 'qa-rt-2294-ma.csv', mimeType: 'text/csv', buffer: Buffer.from('First Name,Last Name,Phone\nQA RT 2294 MA,QA RT 2294 MA,01000022940\n') });
await sleep(5000);
for (let i = 0; i < 4; i++) { if (/Enable manual approval/i.test(await text())) break; await page.click('button:has-text("Next")').catch(() => {}); await sleep(5000); }
await page.getByLabel('Enable manual approval').check().catch(async () => { await page.click('text=Enable manual approval'); });
await sleep(1500); await shot('2294-ma-1-ticked.png');
await page.click('button:has-text("Save & next")'); await sleep(6000); await shot('2294-ma-2-review.png');
const t1 = await text(); log('review', t1.slice(t1.indexOf('Review'), t1.indexOf('Review') + 500).replace(/\s+/g, ' '));
await page.click('text=I confirm I have permission').catch(() => {}); await sleep(800);
const go = await page.$('button:has-text("Submit")');
if (go) { await go.click(); await sleep(15000); }
await shot('2294-ma-3-result.png');
const t2 = await text();
return { started: !!go, result: t2.slice(Math.max(0, t2.indexOf('Result') - 50), t2.indexOf('Result') + 700).replace(/\s+/g, ' ') };
