// NDC-2705 explore (no submit): walk the Leads import wizard and record what each step offers (layout choice?).
await page.goto(H + '/modules/' + T.LEADS + '/import', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000);
const so = await page.$('button:has-text("Start over")'); if (so) { await so.click(); await sleep(3000); }
await (await page.$('input[type=file]')).setInputFiles({ name: 'qa-rt-2705.csv', mimeType: 'text/csv', buffer: Buffer.from('First Name,Last Name,Phone,Email\nQA RT REV 2705 x,QA RT REV 2705 x,01000027050,qa.rt.2705@example.com\n') });
await sleep(5000);
const steps = [];
for (let i = 0; i < 4; i++) {
  await page.click('button:has-text("Next"), button:has-text("Save & next")').catch(() => {}); await sleep(5000);
  const t = await text(); const main = t.slice(t.indexOf('Result') + 6, t.indexOf('Result') + 700).replace(/\s+/g, ' ');
  const selects = await page.$$eval('select, [role=combobox]', els => els.map(e => (e.getAttribute('aria-label') || e.id || e.name || '') + '=' + (e.value || e.innerText || '').slice(0, 40)));
  steps.push({ i, main, selects }); await shot(`2705-step${i + 2}.png`);
  if (/Assign & approve/.test(t)) break;
}
return steps;
