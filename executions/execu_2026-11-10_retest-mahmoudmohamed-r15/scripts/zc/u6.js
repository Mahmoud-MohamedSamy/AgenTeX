const fs=require('fs');
module.exports = async ({ page, log, shot, RUN }) => {
  const S=JSON.parse(fs.readFileSync(RUN+'/out/zoho-2806.json'));
  await page.goto(`https://crm.zoho.com/crm/org944965048/tab/Leads/custom-view/${S.cv}/list`, { waitUntil:'commit', timeout:90000 }).catch(()=>{});
  for (let i=0;i<50;i++){ await page.waitForTimeout(1500); if (/Total Records/i.test(await page.innerText('body').catch(()=>''))) break; }
  await page.waitForTimeout(3000); await shot('c-2806-view-after'); log((await page.innerText('body')).replace(/\s+/g,' ').slice(0,400));
  const e = page.getByText(/Edit View|Edit/).locator('visible=true'); log('edit', await e.count());
};
