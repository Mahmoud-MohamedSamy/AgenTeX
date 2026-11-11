module.exports = async ({ page, log, shot }) => {
  await require('./nav.js').leads(page);
  for (let k=0;k<3;k++){ await page.mouse.click(1497, 23); const z = page.getByText('Zoho',{exact:true}).locator('visible=true');
    for (let i=0;i<30;i++){ await page.waitForTimeout(1500); if (await z.count()) break; } if (await z.count()) { await z.first().click(); break; } }
  for (let i=0;i<30;i++){ await page.waitForTimeout(1500); if (/Desk/.test(await page.innerText('body').catch(()=>''))) break; }
  await page.waitForTimeout(4000); await page.getByText('Zoho Desk',{exact:true}).locator('visible=true').first().scrollIntoViewIfNeeded(); await page.waitForTimeout(2000); await shot('c-2810-zoho-desk-card'); const box = await page.getByText('Zoho Desk',{exact:true}).locator('visible=true').first().boundingBox(); log('box', JSON.stringify(box));
  const t = ((await page.innerText('body'))||'').replace(/\s+/g,' '); log((t.match(/Zoho Desk The Zoho Desk.{0,260}/)||[t.slice(-600)])[0]);
};
