const R = {}; const f = x => FP + x;
await openCreate(); await pick(f('type'), 'Question'); await page.locator(`[data-rule-field=${f('radio')}] input[value=No]`).check(); await sleep(1500);
R.empty = { reason: await vis(f('reason')), tmp: await vis(f('tmp')) };
await typeIn(f('email2'), 'qa@example.com'); R.filled = { reason: await vis(f('reason')), tmp: await vis(f('tmp')) }; await toTop(f('order'), 140); await shot('2980-4-notempty-filled.png'); R.b4 = { tmp: await fbox(f('tmp')), email2: await fbox(f('email2')), radio: await fbox(f('radio')) };
await typeIn(f('email2'), ''); R.cleared = { reason: await vis(f('reason')), tmp: await vis(f('tmp')) };
// editor view of the radio rule
await openRules(); const row = page.locator('tr', { hasText: 'QA RT18 radio' }).first(); R.rowTxt = (await row.innerText()).replace(/\s+/g, ' ');
await row.locator('button').nth(1).click().catch(() => {}); await sleep(5000); const t = await bodyText(); R.editor = (t.match(/[^.]{0,40}(is empty|is not empty|isNull|unknown)[^.]{0,40}/gi) || []).slice(0, 6); await shot('2980-5-editor.png');
R.bEd = []; for (const s of ['is empty', 'is not empty']) R.bEd.push(await box(page.getByText(s, { exact: false }).first()));
return R;
