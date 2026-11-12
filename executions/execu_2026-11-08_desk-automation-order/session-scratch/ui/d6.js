// D6: module "QA AO WF D6" (only system date fields) -> Date-Time trigger: what is offered?
module.exports = async (h) => {
  const { page, shot, log, go } = h;
  await go('/settings/automation/workflow-rules'); await page.getByRole('row').nth(3).waitFor();
  await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
  const dlg = page.getByRole('dialog').first();
  await page.getByRole('button', { name: 'New Rule' }).click(); await dlg.waitFor();
  await dlg.getByRole('button', { name: 'Select a module' }).click(); await page.waitForTimeout(500);
  log('modulesOffered_hasD6', (await page.getByRole('option').allInnerTexts()).filter(x => /D6/.test(x)));
  await page.getByRole('option', { name: /QA AO WF D6/ }).first().click();
  await dlg.getByPlaceholder('e.g. High-Value Lead Notification').fill('QA AO WF D6 date');
  await dlg.getByRole('button', { name: 'Next' }).click(); await page.waitForTimeout(800);
  log('step2', (await dlg.innerText()).split('\n').slice(0, 20));
  await dlg.getByRole('group').getByRole('button', { name: 'Create', exact: true }).click();
  await dlg.getByRole('button', { name: 'Create', exact: true }).last().click(); await page.waitForTimeout(2500);
  const main = page.locator('main').last();
  const bb = await main.getByRole('button', { name: 'Field Changed', exact: true }).first().boundingBox().catch(() => null);
  if (!bb || bb.height < 5) { await main.getByText(/This rule will be executed/).first().click(); await page.waitForTimeout(800); }
  await main.getByText('A Date-Time field', { exact: true }).dispatchEvent('click'); await page.waitForTimeout(800);
  const dt = (await main.innerText()).split('WHEN')[1]?.split('CONDITION')[0] || ''; log('panel', dt.slice(0, 700));
  log("panelButtons", await main.locator("button").evaluateAll(b => b.map(x => (x.getAttribute("aria-label")||"")+"|"+x.innerText.trim().slice(0,30)+"|"+(x.getAttribute("role")||"")).filter(t => /date|pick|layout|Days|before/i.test(t))));
  const pk = main.locator("button", { hasText: "Pick a date field" }).first();
  await pk.dispatchEvent("click").catch(e => log('pkErr', e.message.slice(0, 100))); await page.waitForTimeout(800);
  log('dateOptions', await page.getByRole('option').allInnerTexts());
  log('msg', (await page.locator('body').innerText()).split('\n').filter(l => /no date|cannot use|date field/i.test(l)).slice(0, 5));
  await shot('d6-date-options'); await page.keyboard.press('Escape');
  const combos = main.locator('nothing-here');
  if (await combos.count()) { await combos.first().click(); await page.waitForTimeout(700); log('dateOptions', await page.getByRole('option').allInnerTexts()); await shot('d6-date-options'); await page.keyboard.press('Escape'); }
  await shot('d6-datetime');
  await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
};
