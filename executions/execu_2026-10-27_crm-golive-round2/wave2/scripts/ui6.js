const wait = ms => page.waitForTimeout(ms);
await page.click('[title="Split view"], [aria-label="Split view"]'); await wait(1500);
const create = page.getByText(/Create Split View|New split view/i);
if (!(await page.locator('[role=dialog]').count())) { await page.getByRole('button', { name: /new|create/i }).first().click().catch(() => {}); await wait(1000); }
out.dialog = await page.locator('[role=dialog]').count();
if (out.dialog) {
  await page.fill('input[placeholder="Enter view name"]', 'QA R2W2 SV2');
  await page.locator('[role=dialog]').getByText('No splits chosen yet').click(); await wait(1000);
  await page.getByText('mahmoud.mahamed1515', { exact: true }).click(); await page.getByRole('button', { name: 'Done', exact: true }).click(); await wait(800);
  const dlg = page.locator('[role=dialog]').last();
  for (const f of ['Full Name', 'Lead Owner']) await dlg.getByText(f, { exact: true }).first().click().catch(() => {});
  await page.getByRole('button', { name: 'Save', exact: true }).last().click(); await wait(10000);
  out.splitResult = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 500);
  await page.screenshot({ path: RAW + 'split-view-result2.png' });
}
