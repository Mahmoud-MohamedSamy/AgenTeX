// shared: open Setup > Modules and Fields > Global Sets (retries)
const leads = async (page) => { for (let k=0;k<3;k++){ await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil:'commit', timeout: 90000 }).catch(()=>{});
  for (let i=0;i<50;i++){ await page.waitForTimeout(1500); if (/Total Records/i.test(await page.innerText('body').catch(()=>''))) return true; } } throw new Error('Leads not loading'); };
const nav = async (page) => {
  await leads(page);
  for (let k=0;k<3;k++){ await page.mouse.click(1497, 23);
    const mf = page.getByText('Modules and Fields',{exact:true}).locator('visible=true');
    for (let i=0;i<30;i++){ await page.waitForTimeout(1500); if (await mf.count()) break; }
    if (await mf.count()) { await mf.first().click(); break; } }
  const gs = page.getByText('Global Sets',{exact:true}).locator('visible=true');
  for (let i=0;i<40;i++){ await page.waitForTimeout(1500); if (await gs.count()) break; }
  await gs.first().click(); await page.waitForTimeout(6000);
};
nav.leads = leads; module.exports = nav;
