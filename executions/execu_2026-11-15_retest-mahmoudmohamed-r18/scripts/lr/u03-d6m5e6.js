const R = {}; const f = x => FP + x;
// D6 (2980)
await openCreate();
await page.locator(`[data-rule-field=${f('radio')}] input[value=No]`).check().catch(async () => { await wrap(f('radio')).getByText('No', { exact: true }).click(); }); await sleep(1500);
R.D6_start = await vis(f('reason')); await toTop(f('radio')); await shot('2980-1-radio-no-email-empty.png'); R.b1 = { radio: await fbox(f('radio')), email2: await fbox(f('email2')), reason: await fbox(f('reason')), secB: await box(page.getByText('QA RT18 Sec B', { exact: true }).first()) };
await typeIn(f('email2'), 'qa@example.com'); R.D6_filled = await vis(f('reason')); await toTop(f('radio')); await shot('2980-2-email-filled.png'); R.b2 = { email2: await fbox(f('email2')), reason: await fbox(f('reason')), secB: await box(page.getByText('QA RT18 Sec B', { exact: true }).first()) };
await typeIn(f('email2'), ''); R.D6_cleared = await vis(f('reason')); await toTop(f('radio')); await shot('2980-3-email-cleared.png'); R.b3 = { email2: await fbox(f('email2')), reason: await fbox(f('reason')), secB: await box(page.getByText('QA RT18 Sec B', { exact: true }).first()) };
// M5 (2992)
await openCreate(); await pick(f('type'), 'Refund'); R.M5 = await reqInfo(f('order')); R.M5_label = await wrap(f('order')).locator('label').first().innerText().catch(() => null);
R.M5_html = await wrap(f('order')).evaluate(e => e.outerHTML.replace(/class="[^"]*"/g, '').slice(0, 900));
await toTop(f('order'), 300); await shot('2992-1-order-mandatory.png'); R.bM5 = { order: await fbox(f('order')), type: await fbox(f('type')) };
return R;
