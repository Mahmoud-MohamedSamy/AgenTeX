const R = {}; const f = x => FP + x; const g = a => a.filter(s => /^(Gold|Silver|Bronze)$/.test(s));
await openCreate(); R.none = g(await options(f('tier')));
await pick(f('type'), 'Refund'); R.refund = g(await options(f('tier')));
await pick(f('filter'), 'X'); R.refundX = g(await options(f('tier')));
await toTop(f('type'), 200); await wrap(f('tier')).locator('button[role=combobox]').first().click(); await sleep(800); await shot('2988-1-refund-plus-X.png'); R.b = { type: await fbox(f('type')), filter: await fbox(f('filter')), tier: await fbox(f('tier')), list: await box(page.locator('[role=listbox]').first()) }; await page.keyboard.press('Escape');
await pick(f('type'), 'Question'); R.questionX = g(await options(f('tier')));
await page.locator('button', { hasText: /^Cancel$/ }).first().click().catch(() => {});
return R;
