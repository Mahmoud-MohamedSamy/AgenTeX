const sels = page.locator('select');
const find = async re => { const n = await sels.count(); for (let i = n - 1; i >= 0; i--) { const t = await sels.nth(i).evaluate(s => [...s.options].map(o => o.text).join('|')); if (re.test(t)) return sels.nth(i); } return null; };
await (await find(/Select the related module/)).selectOption({ label: 'Deals' }); await sleep(1200);
await (await find(/Select the relation/)).selectOption({ label: 'Connected To' }); await sleep(1200);
const fa = await find(/None — count records only/); const faOpts = await fa.evaluate(s => [...s.options].map(o => o.text));
if (faOpts.includes('Amount')) await fa.selectOption({ label: 'Amount' }); await sleep(1000);
const fn = await find(/Select a function/); const fnOpts = await fn.evaluate(s => [...s.options].map(o => o.text));
await fn.selectOption({ label: fnOpts.includes('Sum') ? 'Sum' : fnOpts[1] }); await sleep(800);
// label on GENERAL tab
await page.getByText('GENERAL', { exact: true }).last().click(); await sleep(800);
const lab = page.locator('input').filter({ hasNot: page.locator('[type=checkbox]') });
const gen = (await txt()).split('Field Properties')[1]?.slice(0, 500);
return done({ faOpts, fnOpts, gen });
