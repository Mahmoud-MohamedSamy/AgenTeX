const ops = {};
const openPanel = async () => { if (!(await page.getByRole('button', { name: 'Criteria field' }).count())) { await page.locator('main button[aria-label*="ilter"]').first().click(); await sleep(1500); } };
for (const name of ['Due date', 'Subject', 'Related To', 'Owner', 'Tags', 'Status']) {
  try {
  await openPanel();
  await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(1000);
  await page.getByPlaceholder('Search fields').fill(name); await sleep(800);
  await page.getByRole('option', { name, exact: true }).first().click(); await sleep(1500);
  await openPanel();
  await page.locator('button[aria-label^="Operator for"]').first().click(); await sleep(1000);
  ops[name] = []; for (const e of await page.$$('[role=listbox] [role=option]')) ops[name].push((await e.innerText()).trim());
  await page.keyboard.press('Escape'); await sleep(500);
  if (name === 'Status') { await page.locator('button[aria-label^="Value for"]').first().click(); await sleep(1000); ops.statusValues = []; for (const e of await page.$$('[role=listbox] [role=option]')) ops.statusValues.push((await e.innerText()).trim()); await shot('NDC-1788-status-values'); await page.keyboard.press('Escape'); }
  } catch (e) { ops[name] = 'ERR ' + String(e.message).slice(0, 150); await page.keyboard.press('Escape'); }
}
return done(ops);
