const out = {}; const id = made.matrix.rEdge1; const M = made.matrix.mod;
await page.goto(H + `/modules/${M}/records/${id}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/Basic Information|Inputs/i.test(await text())) break; } await sleep(2000);
await page.getByRole('button', { name: /^Edit$/ }).first().click().catch(e => out.editErr = e.message.split('\n')[0]); await sleep(5000);
const inp = page.getByLabel('In URL', { exact: true }).first(); out.before = await inp.inputValue().catch(e => 'ERR ' + e.message.split('\n')[0]); await inp.fill('').catch(() => {});
await page.getByRole('button', { name: /^Save$/ }).first().click().catch(e => out.saveErr = e.message.split('\n')[0]); await sleep(7000);
out.rollupError = /rollup_summary' and cannot be set/i.test(await text()); out.toast = (await page.locator('[data-sonner-toast], li[role=status], [role=alert]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 250);
await shot('desk-edit-save'); log(out); fs.writeFileSync(RUN + '/out/ui-desk-edit.json', JSON.stringify(out, null, 1));
