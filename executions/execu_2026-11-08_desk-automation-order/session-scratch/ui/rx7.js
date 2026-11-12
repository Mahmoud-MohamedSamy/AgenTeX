module.exports = async (h) => {
  const { page, shot, log, go } = h;
  const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
  const latin = t => [...new Set(t.split('\n').map(s => s.trim()).filter(s => /[A-Za-z]{3,}/.test(s) && !/QA |NDC|Tickets?\b.*#|@|https?:|[0-9a-f]{8}-/.test(s) && s.length < 80))].slice(0, 25);
  const setLang = async (re) => { await page.getByRole('button', { name: /^(EN|AR|ع)/ }).first().click(); await page.waitForTimeout(700); const o = page.getByRole('menuitem').or(page.getByRole('option')).filter({ hasText: re }).first(); log('lang_options', await page.getByRole('menuitem').or(page.getByRole('option')).allInnerTexts().catch(() => [])); await o.click(); await page.waitForTimeout(2500); };
  await go('/settings/automation/workflow-rules');
  await setLang(/العربية|Arabic/);
  log('dir', await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction));
  await go('/settings/automation/workflow-rules/new?moduleId=' + T); await page.waitForTimeout(3000);
  log('editor_url', page.url().replace(/^https:\/\/[^/]+/, '')); log('editor_latin', latin(await page.locator('main').last().innerText()));
  await shot('rx-o7-editor');
  // open the action picker
  const add = page.locator('main').last().getByRole('button').filter({ hasText: /إضافة إجراء|Add action/ }).first();
  if (await add.count()) { await add.dispatchEvent('click'); await page.waitForTimeout(800); log('picker_latin', latin(await page.locator('main').last().innerText())); await shot('rx-o7-picker'); }
  await go('/settings/automation/actions'); await page.waitForTimeout(2500); log('actions_latin', latin(await page.locator('main').last().innerText())); await shot('rx-o7-actions');
  await go('/settings/workflow-executions'); await page.waitForTimeout(2500); log('history_latin', latin(await page.locator('main').last().innerText())); await shot('rx-o7-history');
  await go('/settings/automation/workflow-rules'); await setLang(/English|الإنجليزية/);
  log('dir_after', await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction));
};
