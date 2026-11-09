module.exports = async ({ page, shot, log, gotoReady }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/settings/import-history', /Leads Imported/);
  await page.getByText('Leads Imported').first().hover(); await page.waitForTimeout(1000);
  log('delete/undo controls:', await page.locator('text=/delete|undo|remove/i').evaluateAll(es => es.filter(e => e.offsetParent).map(e => e.tagName + ':' + e.innerText.slice(0, 60))));
  await page.getByText('View Imported Modules').first().click(); await page.waitForTimeout(5000);
  await shot('imp-history-view');
  log((await page.innerText('body')).replace(/\s+/g, ' ').replace(/^.*?Guided Selling /, '').slice(0, 1500));
};
