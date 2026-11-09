// NDC-2294 items 1–2 on screen: Leads › Import wizard. Walks to the step with the automation option using a 1-row CSV, does NOT finish the import.
await page.goto(H + '/modules/' + T.LEADS + '/import', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000);
await shot('2294-import-1.png');
let t = await text(); const steps = [];
// upload a one-row CSV (in memory) to reach the later steps
const input = await page.$('input[type=file]');
if (input) {
  await input.setInputFiles({ name: 'qa-rt-2294.csv', mimeType: 'text/csv', buffer: Buffer.from('First Name,Last Name,Phone\nQA RT 2294 IMP,QA RT 2294 IMP,01000002294\n') });
  await sleep(5000);
  for (let i = 0; i < 4; i++) {
    t = await text(); steps.push(t.slice(0, 200).replace(/\s+/g, ' '));
    if (/Trigger automation|Trigger workflow|manual approval/i.test(t)) break;
    const next = await page.$('button:has-text("Next")'); if (!next) break; await next.click().catch(() => {}); await sleep(5000);
  }
}
t = await text();
await shot('2294-import-2.png');
return { url: page.url(), hasInput: !!input, steps, hasTrigger: (t.match(/.{0,40}Trigger automation and process management.{0,160}/is) || [''])[0], hasOld: /Trigger workflow rules/i.test(t), manual: (t.match(/.{0,60}manual (record )?approval.{0,80}/is) || [''])[0] };
