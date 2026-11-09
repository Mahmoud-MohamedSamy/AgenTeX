module.exports = async ({ page, shot, log, gotoReady }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/settings/import-history', /Import History|qa-rt-2302|Invalid URL/i);
  await page.waitForTimeout(4000);
  log(page.url()); await shot('imp-history');
  log((await page.innerText('body')).replace(/\s+/g, ' ').replace(/^.*?Guided Selling /, '').slice(0, 3000));
};
