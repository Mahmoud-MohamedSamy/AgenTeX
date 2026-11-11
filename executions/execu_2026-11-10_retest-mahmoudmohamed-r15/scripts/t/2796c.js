await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if ((await page.$$('input,textarea')).length > 4) break; } await sleep(2000);
const lay = page.locator('select').first();
const layState = async () => lay.evaluate(s => ({sel: s.options[s.selectedIndex].text, opts: [...s.options].map(o=>o.text)}));
const out = { start: await layState() };
// pick department
await page.getByText('Department', {exact:true}).first().locator('xpath=following::button[1]').click(); await sleep(1500);
const inp = page.locator('input:focus'); if (await inp.count()) await inp.fill('QA NDC Accounting'); await sleep(1500);
await page.getByRole('option', {name:/^QA NDC Accounting$/}).first().click().catch(async()=>{ await page.getByText('QA NDC Accounting', {exact:true}).last().click(); });
await sleep(4000);
out.afterDept = await layState();
out.deptShown = (await page.getByText('Department', {exact:true}).first().locator('xpath=following::button[1]').innerText()).replace(/\s+/g,' ');
out.admFields = ['IATA Source','ADM Number','Airline Code','ADM Reason'].map(f => f+':'+(/./.test(f) ? 0 : 0));
const t = await text(); out.admFields = ['IATA Source','ADM Number','Airline Code','ADM Reason'].filter(f => t.includes(f));
await shot('2796-create-accounting.png');
return out;
