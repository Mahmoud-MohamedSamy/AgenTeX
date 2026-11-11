module.exports = async ({ page, log, shot }) => {
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil:'domcontentloaded' });
  for (let i=0;i<40;i++){ await page.waitForTimeout(1500); if (/QA RT15 2806 green lead/i.test(await page.innerText('body').catch(()=>''))) break; }
  await page.mouse.click(1497, 23); await page.waitForTimeout(4000); await shot('c-gear');
  const mf = page.getByText('Modules and Fields',{exact:true}).locator('visible=true'); log('mf', await mf.count());
  if (await mf.count()) { await mf.first().click(); }
  const gs = page.getByText('Global Sets',{exact:true}).locator('visible=true');
  for (let i=0;i<40;i++){ await page.waitForTimeout(1500); if (await gs.count()) break; }
  await shot('c-2806-modules'); log('gs visible', await gs.count());
  if (await gs.count()) { await gs.first().click(); await page.waitForTimeout(8000); await shot('c-2806-gs-list'); log((await page.innerText('body')).replace(/\s+/g,' ').slice(0,800)); }
};
