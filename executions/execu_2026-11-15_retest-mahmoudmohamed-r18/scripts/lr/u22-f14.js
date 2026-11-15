const R = {}; const f = x => FP + x;
const edit = async () => { await openRec(MID, I.massB); await page.getByRole('button', { name: /^Edit$/ }).first().click(); await page.waitForSelector('[data-rule-field]', { timeout: 40000 }).catch(() => {}); await sleep(4000); };
await edit(); await pick(f('filter'), 'Y'); R.first = await page.getByText(/Suggested: 42/).count(); await toTop(f('type'), 200); await shot('2996-5-suggest-first.png');
await page.getByRole('button', { name: /^Ignore$/ }).first().click(); await sleep(800); R.afterIgnore = await page.getByText(/Suggested: 42/).count();
await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000); if (await page.getByText('Verify these values').count()) { await page.getByRole('button', { name: /^Continue$/ }).click(); await sleep(3500); }
R.url = page.url().slice(-50);
await edit(); R.reopen = await page.getByText(/Suggested: 42/).count(); await toTop(f('type'), 200); await shot('2996-6-suggest-again.png'); R.bSug = await box(page.getByText(/Suggested: 42/).first()); R.bFilter = await fbox(f('filter'));
await page.locator('button', { hasText: /^Cancel$/ }).first().click().catch(() => {});
return R;
