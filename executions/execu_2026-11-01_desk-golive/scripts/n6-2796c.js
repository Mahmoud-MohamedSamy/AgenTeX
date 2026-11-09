const o = {}; const dlg = page.locator('[role=dialog]');
await page.mouse.click(959, 377); await sleep(600);
await dlg.locator('button', { hasText: /^Save$/ }).click().catch(e => o.e = e.message.slice(0, 60)); await sleep(3500);
o.open = await dlg.count();
// create form in QA NDC Accounting
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && /Create Ticket/.test(t)) break; }
await sleep(2000);
const dep = page.locator('xpath=//*[normalize-space(text())="Department"]/ancestor::*[self::div][2]//button | //*[normalize-space(text())="Department"]/ancestor::*[self::div][2]//*[@role="combobox"]').first();
await dep.click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(1200);
const inp = page.locator('input:focus'); if (await inp.count()) { await inp.fill('QA NDC Accounting'); await sleep(1200); }
await page.getByRole('option', { name: /^QA NDC Accounting$/ }).first().click().catch(e => o.e3 = e.message.slice(0, 60)); await sleep(3500);
const t = (await txt()).replace(/\s+/g, ' '); o.head = t.match(/Create Ticket.{0,200}/)?.[0];
o.layoutSelect = await page.evaluate(() => { const b = [...document.querySelectorAll('button,[role=combobox],select')].find(e => /QA NDC (ADM|Accounting)/.test(e.innerText || e.value || '') && e.getBoundingClientRect().y < 160); return b ? (b.innerText || b.value).trim() : null; });
o.hasADMfields = /IATA Source|ADM Number|Airline Code/.test(t);
o.shot = await shot('rt/2796-create-acc');
return JSON.stringify(o);
