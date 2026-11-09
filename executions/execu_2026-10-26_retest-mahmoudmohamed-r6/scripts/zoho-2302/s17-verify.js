// Final verification that nothing named QA RT 2302 remains (leads, blueprints, recycle bin).
module.exports = async ({ page, shot, log, api, gotoReady }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/settings/blueprint', /Lead nurturing process/);
  log('BLUEPRINT LIST has QA RT 2302:', /QA RT 2302/.test(await page.innerText('body')));
  await shot('verify-bp-list');
  const r = await api('GET', '/crm/v2.2/Leads/search?word=' + encodeURIComponent('QA RT 2302'));
  log('LEADS word search status', r.status, r.body.slice(0, 200));
  const r2 = await api('GET', '/crm/v2.2/Leads/search?criteria=' + encodeURIComponent('(Last_Name:starts_with:QA RT 2302)'));
  log('LEADS criteria search status', r2.status, r2.body.slice(0, 200));
  await gotoReady('https://crm.zoho.com/crm/org943261092/settings/recyclebin', /Recycle Bin/);
  log('RECYCLE BIN has QA RT 2302:', /QA RT 2302/.test(await page.innerText('body')));
};
