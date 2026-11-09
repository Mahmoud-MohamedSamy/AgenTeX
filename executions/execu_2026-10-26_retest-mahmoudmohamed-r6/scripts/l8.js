const S = () => page.locator('select:visible');
const relSel = S().filter({ hasText: 'Select the related module' }).first();
const out = {};
for (const mod of ['Customers', 'Transactions']) { await relSel.selectOption({ label: mod }); await sleep(2500);
  out[mod] = { relations: await S().filter({ hasText: 'Select the relation' }).first().locator('option').allInnerTexts().catch(() => []), warn: (await panelText() || '').split('\n').filter(l => /no lookup|pointing/i.test(l)) }; }
await shot('1444-02-transactions-relations');
return done(out);
