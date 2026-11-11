module.exports = async ({ page, log, shot }) => {
  await require('./nav.js').leads(page);
  for (let k=0;k<3;k++){ await page.mouse.click(1497, 23); const bp = page.getByText('Blueprint',{exact:true}).locator('visible=true');
    for (let i=0;i<30;i++){ await page.waitForTimeout(1500); if (await bp.count()) break; } if (await bp.count()) { await bp.first().click(); break; } }
  const ln = page.getByText('Lead nurturing process',{exact:true}).locator('visible=true');
  for (let i=0;i<40;i++){ await page.waitForTimeout(1500); if (await ln.count()) break; }
  await ln.first().click(); await page.waitForTimeout(15000);
  await page.mouse.click(608, 262); await page.waitForTimeout(4000); await shot('c-2729-bp-transition');
  const af = page.getByText('After',{exact:true}).locator('visible=true'); log('after', await af.count());
  if (await af.count()) { await af.first().click(); await page.waitForTimeout(3000); }
  await page.mouse.click(1202, 367); await page.waitForTimeout(3000); await shot('c-2729-bp-task-menu');
  const nt = page.getByText(/^New Task$/).locator('visible=true'); log('newtask', await nt.count()); if (await nt.count()) { await nt.first().click(); await page.waitForTimeout(4000); }
  await shot('c-2729-bp-task-form');
  log(((await page.innerText('body'))||'').replace(/\s+/g,' ').slice(-700));
};
