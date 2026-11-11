// delete my two QA RT15 views in the UI (Leads)
module.exports = async ({ page, log, shot, args }) => {
  for (const name of ['QA RT15 2807 view', 'QA RT15 2806 Green view']) {
    await require('./view.js')(page, name);
    const chip = page.getByText(name, { exact: true }).locator('visible=true').first(); const b = await chip.boundingBox();
    await page.mouse.click(b.x + b.width + 4, b.y + b.height / 2); await page.waitForTimeout(2000); await shot('c-clean-viewmenu');
    const del = page.getByText(/^Delete( View)?$/).locator('visible=true'); log(name, 'delete items', await del.count());
    if (!(await del.count())) continue;
    await del.first().click(); await page.waitForTimeout(2000); await shot('c-clean-viewconfirm');
    const ok = page.getByRole('button', { name: /^(Delete|Yes|OK)$/ }).locator('visible=true'); log('confirm', await ok.count());
    if (await ok.count()) { await ok.last().click(); await page.waitForTimeout(4000); }
    log(name, 'still shown', await page.getByText(name, { exact: true }).locator('visible=true').count());
  }
};
