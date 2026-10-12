const off = capOn(); const out = {};
await go('/settings/automation/workflow-rules/new?moduleId=784400e1-4a2a-42c2-b4f3-7ca56e79828a', 9000);
await page.getByRole('button', { name: /Add action/ }).first().click(); await sleep(800);
await page.getByText('Owner Assignment', { exact: true }).first().click(); await sleep(2000);
const before = cap.length;
await page.getByText('Roles', { exact: true }).last().click(); await sleep(2500);
out.panel = (await txt()).split('Owner Assignment').slice(-1)[0].slice(0, 800);
const sel = page.getByText(/^Select…?\.{0,3}$/).last(); if (await sel.count()) { await sel.click(); await sleep(1500); }
else { const cb = page.locator('[role=combobox]').last(); await cb.click(); await sleep(1500); }
out.options = await page.locator('[role=option],[role=listbox] li,[cmdk-item]').allInnerTexts();
await shot('NDC-2204-roles-list');
out.calls = cap.slice(before);
await page.keyboard.press('Escape');
await go('/settings/roles', 8000);
const t = await txt(); out.rolesPage = t.slice(t.lastIndexOf('Roles')-0, t.lastIndexOf('Roles') + 1200);
await shot('NDC-2204-desk-roles-page');
out.rolesCalls = cap.filter(c => /role|profile/i.test(c));
off(); return done(out);
