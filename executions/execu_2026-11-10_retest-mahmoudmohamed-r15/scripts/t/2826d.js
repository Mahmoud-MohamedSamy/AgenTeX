await page.goto(H + '/settings/automation/sla', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/SLA Policies/.test(await text())) break; } await sleep(3000);
const ds = page.locator('select').filter({ has: page.locator('option', {hasText:'QA AO Dept A'}) }).first();
if (await ds.count()) await ds.selectOption({label:'QA AO Dept A'}); else { await page.getByText('Customer Support', {exact:true}).last().click(); await sleep(1000); await page.getByRole('option', {name:'QA AO Dept A'}).first().click(); }
await sleep(4000);
await page.getByText('QA RT15 2826 SLA', {exact:true}).first().click(); await sleep(5000);
log('url', page.url()); await shot('2826-editor.png');
const nxt = page.getByRole('button', {name:/^Next$/}); if (await nxt.count()) { await nxt.first().click(); await sleep(3000); }
const row = page.locator('div', {hasText: /^amount > 1000/}).last(); await page.getByText('amount > 1000', {exact:true}).first().locator('xpath=ancestor::*[.//button][1]').locator('button').first().click(); await sleep(3000);
await shot('2826-target-amount.png');
const sels = await page.$$eval('select', ss => ss.map(s => ({sel: s.options[s.selectedIndex] && s.options[s.selectedIndex].text, opts: [...s.options].map(o=>o.text)})));
log('operator selects', sels.filter(s => /greater|less|before|after|between|is empty|isn/i.test(s.opts.join(','))).map(s=>s.sel+' :: '+s.opts.join(', ')));
log('text', (await text()).split('\n').filter(l=>/greater|less than|before|after|between|QA NDC Amount|Due Date/i.test(l)).slice(0,15));
await page.getByText('is greater than', {exact:true}).first().click(); await sleep(1500);
log('number operators', await page.$$eval('[role=option]', os => os.map(o=>o.innerText.trim())));
await shot('2826-number-operators.png');
await page.keyboard.press('Escape'); await sleep(500);
await page.getByRole('button', {name:/^(Cancel|Back|Close)$/}).last().click().catch(()=>{}); await sleep(2000);
await page.getByText('due date after 2027-01-01', {exact:true}).first().locator('xpath=ancestor::*[.//button][1]').locator('button').first().click(); await sleep(3000);
const dop = page.getByText(/^is after$/).first(); log('date op shown', await dop.count());
await dop.click(); await sleep(1500);
log('date operators', await page.$$eval('[role=option]', os => os.map(o=>o.innerText.trim())));
await shot('2826-date-operators.png');
