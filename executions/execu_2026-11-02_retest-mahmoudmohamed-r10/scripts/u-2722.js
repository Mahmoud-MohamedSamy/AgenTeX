// NDC-2722: import with error rows → Review (counts + errors) → close → Import again → Resume → Review must still show counts + errors. Nothing is submitted.
const st = {};
const wait = async (re, s = 90) => { for (let i = 0; i < s / 2; i++) { if (re.test(await text())) return true; await sleep(2000); } return false; };
await page.goto(H + '/modules/' + T.LEADS + '/import', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60 && !(await page.locator('input[type=file]').count()); i++) { const so = page.getByRole('button', { name: 'Start over' }); if (await so.count()) await so.click(); await sleep(2000); }
const rows = ['First Name,Last Name,Phone,Email', 'QA RT r10 2722 a,QA RT r10 2722 a,01002722001,not-an-email', 'QA RT r10 2722 b,QA RT r10 2722 b,01002722002,also bad', 'QA RT r10 2722 c,QA RT r10 2722 c,01002722003,qa.r10.2722c@example'];
await page.locator('input[type=file]').setInputFiles({ name: 'qa-r10-2722.csv', mimeType: 'text/csv', buffer: Buffer.from(rows.join('\n') + '\n') });
await sleep(4000); await page.getByRole('button', { name: 'Next' }).click(); await sleep(6000);
await page.locator('select').first().selectOption({ label: 'Standard' }).catch(() => {}); await page.getByText('Add new records', { exact: true }).click().catch(() => {}); await sleep(800);
await page.getByRole('button', { name: 'Next' }).click(); await sleep(7000);
await page.getByRole('button', { name: 'Next' }).click(); await sleep(7000);
await page.getByRole('button', { name: 'Save & next' }).click(); await wait(/Rows with errors|Validation errors|I confirm/, 60); await sleep(3000);
await shot('2722-1-review-first.png');
const r1 = await text(); st.first = { willImport: (r1.match(/Rows that will import\s*(\d+)/) || [])[1], withErrors: (r1.match(/Rows with errors\s*(\d+)/) || [])[1], validation: /Validation errors/.test(r1), errSample: (r1.match(/Validation errors[\s\S]{0,300}/) || [''])[0].replace(/\s+/g, ' ') };
// close wizard
await page.getByRole('button', { name: /close/i }).first().click().catch(() => page.mouse.click(1565, 36)); await sleep(5000);
await page.goto(H + '/modules/' + T.LEADS + '/import', { waitUntil: 'commit', timeout: 120000 });
await wait(/Resume|import in progress/i, 120); await shot('2722-2-banner.png');
await page.getByRole('button', { name: 'Resume' }).click(); await sleep(8000);
await wait(/Review|I confirm/, 30); await sleep(3000); await shot('2722-3-review-resumed.png');
const r2 = await text(); st.resumed = { willImport: (r2.match(/Rows that will import\s*(\d+)/) || [])[1], withErrors: (r2.match(/Rows with errors\s*(\d+)/) || [])[1], validation: /Validation errors/.test(r2), confirmShown: /I confirm I have permission/.test(r2), step: (r2.match(/Assign[\s\S]{0,40}Review/) || [''])[0].length > 0 };
// leave it: Start over so nothing stays in progress
await page.goto(H + '/modules/' + T.LEADS + '/import', { waitUntil: 'commit', timeout: 120000 }); await wait(/Start over|Resume/, 90); const so = page.getByRole('button', { name: 'Start over' }); if (await so.count()) { await so.click(); await sleep(3000); st.startedOver = true; }
return st;
