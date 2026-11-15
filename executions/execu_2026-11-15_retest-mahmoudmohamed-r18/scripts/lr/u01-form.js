const R = {};
await openCreate(); R.n = await page.locator('[data-rule-field]').count();
// D5: owner rule shows order with default owner
R.owner = await valOf('owner'); R.D5_orderVisDefault = await vis(FP + 'order');
await shot('2979-1-create-default-owner.png'); R.box_owner = await fbox('owner'); R.box_order = await fbox(FP + 'order'); R.box_secA = await box(page.getByText('QA RT18 Sec A', { exact: true }).first());
return R;
