const sels = page.locator('select');
const find = async re => { const n = await sels.count(); for (let i = n - 1; i >= 0; i--) { const t = await sels.nth(i).evaluate(s => [...s.options].map(o => o.text).join('|')); if (re.test(t)) return sels.nth(i); } return null; };
const out = {};
for (const mod of ['Deals', 'Contacts', 'Accounts', 'Tasks']) {
  const rm = await find(/Select the related module/); await rm.selectOption({ label: mod }); await sleep(1500);
  const rl = await find(/Select the relation/); const opts = rl ? await rl.evaluate(s => [...s.options].map(o => o.text)) : null;
  const warn = (await txt()).match(/The selected module has no lookup[^\n]*/)?.[0] || null;
  out[mod] = { relations: opts, warn };
  if (mod === 'Deals') await shot('1444-02-deals-relations');
}
return done(out);
