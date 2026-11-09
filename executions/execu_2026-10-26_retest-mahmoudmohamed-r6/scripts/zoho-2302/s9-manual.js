// Control C: create "QA RT 2302 manual" through the Create Lead form.
module.exports = async ({ page, shot, log, gotoReady }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/tab/Leads/create', /Lead Information/);
  await page.locator('#Crm_Leads_LASTNAME_LInput').fill('QA RT 2302 manual');
  await page.locator('[data-zcqa="COMPANY"] input').first().fill('QA RT 2302 Co');
  await page.waitForTimeout(800);
  await shot('manual-form');
  await page.getByText('Save', { exact: true }).locator('visible=true').first().click();
  await page.waitForTimeout(8000);
  log('AFTER', page.url());
  await shot('manual-after-save', { clip: { x: 0, y: 0, width: 1600, height: 420 } });
};
