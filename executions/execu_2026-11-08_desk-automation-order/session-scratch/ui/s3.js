const { execSync } = require('child_process');
const RUN = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-08_desk-automation-order';
const ids = JSON.parse(require('fs').readFileSync(RUN + '/a4/s3prep.json', 'utf8'));
module.exports = async ({ page, go, shot, log }) => {
  await go('/settings/automation/workflow-rules'); await page.getByRole('row').nth(3).waitFor();
  const search = page.getByPlaceholder('Search rules…');
  // B2 trigger texts
  log('B2', await page.$$eval('tbody tr', rs => [...new Set(rs.map(r => r.children[4] && r.children[4].innerText.trim()))]));
  // B4 module filter
  const mod = page.getByText('All modules', { exact: true }).first(); await mod.click(); await page.waitForTimeout(800);
  log('B4_options', (await page.getByRole('option').allInnerTexts()).concat(await page.getByRole('menuitem').allInnerTexts()));
  await shot('s3-module-filter'); await page.keyboard.press('Escape');
  // B5 empty search
  await search.fill('zzzz no such rule'); await page.waitForTimeout(1200);
  log('B5', (await page.locator('main').last().innerText()).split('\n').filter(l => /no |found|match|empty|rule/i.test(l)).slice(-6)); await shot('s3-empty');
  // B10 bulk delete 2
  await search.fill('QA AO WF B10'); await page.waitForTimeout(1500);
  for (const n of ['QA AO WF B10a', 'QA AO WF B10b']) await page.getByLabel('Select ' + n).check();
  await page.waitForTimeout(500); await shot('s3-b10-selected');
  log('B10_bar', (await page.getByRole('button').allInnerTexts()).filter(t => /delete|activate|selected/i.test(t)));
  await page.getByRole('button', { name: /^Delete/ }).first().click(); await page.waitForTimeout(800);
  log('B10_dialog', await page.getByRole('alertdialog').or(page.getByRole('dialog')).first().innerText().catch(() => 'no dialog')); await shot('s3-b10-dialog');
  await page.getByRole('alertdialog').or(page.getByRole('dialog')).first().getByRole('button', { name: /delete/i }).last().click();
  await page.waitForTimeout(2500); log('B10_toast', await page.locator('[data-sonner-toast]').allInnerTexts()); await shot('s3-b10-after');
  // B11 partial: select both, delete one by API, then confirm
  await search.fill('QA AO WF B11'); await page.waitForTimeout(1500);
  for (const n of ['QA AO WF B11a', 'QA AO WF B11b']) await page.getByLabel('Select ' + n).check();
  await page.getByRole('button', { name: /^Delete/ }).first().click(); await page.waitForTimeout(800);
  require('fs').writeFileSync(RUN + '/scripts/.b11del.js', `const r=await api('DELETE','/workflow/rules/${ids.B11a}');return r.s;`);
  log('B11_apiDelete', execSync(`node api.js ndc-staging-owner .b11del.js`, { cwd: RUN + '/scripts' }).toString().trim());
  await page.getByRole('alertdialog').or(page.getByRole('dialog')).first().getByRole('button', { name: /delete/i }).last().click();
  await page.waitForTimeout(2500); log('B11_toast', await page.locator('[data-sonner-toast]').allInnerTexts()); await shot('s3-b11-after');
  log('B11_rowsLeft', await page.$$eval('tbody tr', rs => rs.map(r => r.innerText.split('\t')[0].trim()).filter(Boolean)));
};
