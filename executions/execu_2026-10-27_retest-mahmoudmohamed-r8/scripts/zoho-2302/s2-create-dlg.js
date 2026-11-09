module.exports = async ({ page, shot, log, gotoReady }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/settings/blueprint', /Lead nurturing process/);
  await page.locator('text=/^\s*Create Blueprint\s*$/').last().click();
  await page.waitForTimeout(4000);
  await shot('bp-create-dlg');
  log(await page.evaluate(() => [...document.querySelectorAll('lyte-modal, lyte-wormhole, [role=dialog]')].map(e => e.tagName + ' ' + e.innerText.replace(/\s+/g,' ').slice(0,800)).join('\n---\n')));
};
