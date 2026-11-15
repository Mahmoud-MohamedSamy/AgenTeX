const R = {};
await openCreate(); R.owner0 = await valOf('owner'); R.order0 = await vis(FP + 'order');
await toTop('owner'); await shot('2979-1-default-owner.png'); R.b1 = { owner: await fbox('owner'), order: await fbox(FP + 'order'), secA: await box(page.getByText('QA RT18 Sec A', { exact: true }).first()) };
const cb = wrap('owner').locator('button[role=combobox]'); await cb.last().click(); await sleep(1500);
const other = page.locator('[role=option]').filter({ hasNotText: 'ndc-staging-owner' }).first(); if (await other.count()) { await other.click(); await sleep(1800); }
R.owner1 = await valOf('owner'); R.order1 = await vis(FP + 'order'); await toTop('owner'); await shot('2979-2-other-owner.png'); R.b2 = { owner: await fbox('owner'), secA: await box(page.getByText('QA RT18 Sec A', { exact: true }).first()), note: await fbox(FP + 'note') };
await cb.last().click(); await sleep(1500); const inp = page.locator('[role=dialog] input, [cmdk-input], [role=listbox] input').first(); if (await inp.count()) { await inp.fill('ndc-staging'); await sleep(2000); }
const back = page.locator('[role=option]').filter({ hasText: 'ndc-staging-owner' }).first(); if (await back.count()) { await back.click(); await sleep(1800); }
R.owner2 = await valOf('owner'); R.order2 = await vis(FP + 'order'); await toTop('owner'); await shot('2979-3-owner-back.png'); R.b3 = { owner: await fbox('owner'), order: await fbox(FP + 'order') };
return R;
