// NDC-2705: import ONE QA lead into Leads › "Standard Layout" (QA review process, Excel channel ticked). TRIGGER = on|off (automation option).
const TRIGGER = 'on'; const NAME = 'QA RT REV 2705 ' + TRIGGER;
await page.goto(H + '/modules/' + T.LEADS + '/import', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000);
const so = await page.$('button:has-text("Start over")'); if (so) { await so.click(); await sleep(3000); }
await (await page.$('input[type=file]')).setInputFiles({ name: `qa-rt-2705-${TRIGGER}.csv`, mimeType: 'text/csv', buffer: Buffer.from(`First Name,Last Name,Phone,Email\n${NAME},${NAME},0100002705${TRIGGER === 'on' ? 1 : 0},qa.rt.2705.${TRIGGER}@example.com\n`) });
await sleep(5000); await page.click('button:has-text("Next")'); await sleep(5000);
await page.getByLabel('Target layout').selectOption({ label: 'Standard Layout' }).catch(async () => { await page.selectOption('select', { label: 'Standard Layout' }); });
await sleep(1000); await shot(`2705-${TRIGGER}-layout.png`);
await page.click('button:has-text("Next"), button:has-text("Save & next")'); await sleep(6000);
await page.click('button:has-text("Next"), button:has-text("Save & next")'); await sleep(6000);
if (TRIGGER === 'on') await page.getByLabel('Trigger automation and process management').check().catch(() => page.click('text=Trigger automation and process management'));
await sleep(1000); await shot(`2705-${TRIGGER}-assign.png`);
await page.click('button:has-text("Save & next")'); await sleep(6000);
const rv = await text(); log('review', (rv.match(/Target layout.{0,200}/s) || [''])[0].replace(/\s+/g, ' '));
await page.click('text=I confirm I have permission').catch(() => {}); await sleep(800);
await page.click('button:has-text("Submit")'); await sleep(20000); await shot(`2705-${TRIGGER}-result.png`);
const t = await text(); return { result: (t.match(/Import complete.{0,200}/s) || [t.slice(0, 200)])[0].replace(/\s+/g, ' ') };
