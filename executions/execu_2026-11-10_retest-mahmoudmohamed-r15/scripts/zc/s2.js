module.exports = async ({ page, api, gotoReady, log, shot }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/tab/Leads', /Leads/);
  await page.waitForTimeout(5000); await shot('probe-leads');
  await page.goto('https://crm.zoho.com/crm/org943261092/settings/modules', { waitUntil:'domcontentloaded' });
  await page.waitForTimeout(40000);
  log('frames', page.frames().map(f=>f.url().slice(0,100)));
  for (const f of page.frames()) log(f.url().slice(0,60), (await f.innerText('body').catch(()=>'')).replace(/\s+/g,' ').slice(0,300));
  await shot('probe-modules');
};
