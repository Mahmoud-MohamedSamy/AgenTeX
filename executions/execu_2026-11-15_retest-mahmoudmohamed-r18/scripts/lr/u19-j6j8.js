const R = {}; const f = x => FP + x;
await openCreate(); R.typeOpts = (await options(f('type'))).filter(s => /Refund|Question|Partner|Other/.test(s));
await pick(f('type'), 'Refund'); R.refund_order = { vis: await vis(f('order')), req: await reqInfo(f('order')) };
await page.locator(`[data-rule-field=${f('radio')}] input[value=Yes]`).check(); await sleep(1200); R.yes_email2 = await reqInfo(f('email2'));
await tick(f('vip'), true); R.vip_note = await reqInfo(f('note'));
await toTop(f('order'), 220); await shot('2982-5-after-section-option-delete.png'); R.b = { order: await fbox(f('order')), note: await fbox(f('note')), type: await fbox(f('type')), vip: await fbox(f('vip')), email2: await fbox(f('email2')), radio: await fbox(f('radio')) };
await openRules(); R.rows = (await page.locator('tr', { hasText: 'QA RT18' }).allInnerTexts()).map(s => s.replace(/\s+/g, ' ')); await shot('2982-6-rule-list.png');
return R;
