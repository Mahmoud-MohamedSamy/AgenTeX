const R = {}; const f = x => FP + x; const sb = async () => box(page.getByText('QA RT18 Sec B', { exact: true }).first());
await openCreate(); await pick(f('type'), 'Question'); R.secB_q = !!(await sb()); R.reason_q = await vis(f('reason'));
await page.locator(`[data-rule-field=${f('radio')}] input[value=No]`).check(); await sleep(1500);
R.D6_start = await vis(f('reason')); await toTop(f('reason'), 130); await shot('2980-1-radio-no-email-empty.png'); R.b1 = { email2: await fbox(f('email2')), radio: await fbox(f('radio')), reason: await fbox(f('reason')), secB: await sb() };
await typeIn(f('email2'), 'qa@example.com'); R.D6_filled = await vis(f('reason')); await toTop(f('type'), 200); await shot('2980-2-email-filled.png'); R.b2 = { email2: await fbox(f('email2')), reason: await fbox(f('reason')), secB: await sb() };
await typeIn(f('email2'), ''); R.D6_cleared = await vis(f('reason')); await toTop(f('reason'), 130); await shot('2980-3-email-cleared.png'); R.b3 = { email2: await fbox(f('email2')), reason: await fbox(f('reason')), secB: await sb() };
return R;
