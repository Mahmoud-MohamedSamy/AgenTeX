// Find "Import History" in the Leads list menus.
module.exports = async ({ page, shot, log, gotoReady }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/tab/Leads', /Create Lead/);
  await page.mouse.click(1557, 115); await page.waitForTimeout(1500);
  log('MORE MENU', (await page.locator('lyte-menu-body:visible, lyte-drop-box:visible').allInnerTexts()).join('|').replace(/\s+/g, ' '));
  const h = page.getByText(/Import History/i).locator('visible=true');
  log('history links', await h.count());
  if (await h.count()) { await h.first().click(); await page.waitForTimeout(8000); log(page.url()); await shot('imp-history'); log((await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 2500)); }
};
