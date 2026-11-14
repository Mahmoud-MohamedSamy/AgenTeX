const openBuilder = async () => {
  await go('/analytics/reports/builder', 4000); await page.getByRole('button', { name: 'Select Primary Module' }).waitFor({ timeout: 60000 });
  await page.getByLabel('Report Name').fill('QA GL W5 report');
  await page.getByRole('button', { name: 'Select Primary Module' }).click(); await sleep(1500);
  await page.getByRole('option', { name: /^Tickets/ }).first().click(); await sleep(1000);
  await page.getByRole('button', { name: /^Create$/ }).click();
  for (let i = 0; i < 20; i++) { await sleep(2000); if (/Continue/.test(await mtxt())) break; }
  await page.getByRole('button', { name: /^Continue$/ }).click();
  for (let i = 0; i < 15; i++) { await sleep(2000); if (/Run Preview|Edit columns/.test(await mtxt())) break; }
};
const dtxt = async () => (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
const pickF = async (btn, field) => { await page.getByRole('button', { name: btn }).click(); await sleep(1500); const d = page.locator('[role=dialog]').last();
  await d.getByPlaceholder('Search fields…').fill(field); await sleep(800); await d.getByText(new RegExp('^' + field + '$')).first().click(); await sleep(800);
  await d.getByRole('button', { name: /^Done$/ }).last().click(); await sleep(1500); };
