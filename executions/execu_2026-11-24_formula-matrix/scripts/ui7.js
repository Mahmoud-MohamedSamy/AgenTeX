// Clear a text field through the Edit form and save; then the API tells whether it was stored as "" or null.
const id = made.matrix.rEdge1; const out = {};
await page.goto(H + `/modules/${made.mod}/records/${id}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/Basic Information/i.test(await text())) break; } await sleep(2000);
await page.getByRole('button', { name: /^Edit$/ }).first().click(); await sleep(5000);
const inp = page.getByLabel('In URL', { exact: true }).first(); out.before = await inp.inputValue().catch(e => 'ERR ' + e.message.split('\n')[0]);
await inp.fill(''); await sleep(500);
const inp2 = page.getByLabel('In Email', { exact: true }).first(); out.beforeEmail = await inp2.inputValue().catch(() => ''); await inp2.fill(''); await sleep(500);
await shot('form-clear-before-save');
await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(6000); await shot('form-clear-after-save');
out.toast = (await page.locator('[data-sonner-toast], li[role=status], [role=alert]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 200);
log(out); fs.writeFileSync(RUN + '/out/ui-clear.json', JSON.stringify(out, null, 1));
