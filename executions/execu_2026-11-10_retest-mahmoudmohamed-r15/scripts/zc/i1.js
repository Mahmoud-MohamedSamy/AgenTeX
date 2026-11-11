module.exports = async ({ page, log, shot }) => {
  await require('./nav.js').leads(page);
  for (let k=0;k<3;k++){ await page.mouse.click(1497, 23); const z = page.getByText('Zoho',{exact:true}).locator('visible=true');
    for (let i=0;i<30;i++){ await page.waitForTimeout(1500); if (await z.count()) break; } if (await z.count()) { await z.first().click(); break; } }
  for (let i=0;i<30;i++){ await page.waitForTimeout(1500); if (/Desk/.test(await page.innerText('body').catch(()=>''))) break; }
  await page.waitForTimeout(4000); await shot('c-2810-zoho-integrations');
  const t = ((await page.innerText('body'))||'').replace(/\s+/g,' '); log((t.match(/.{0,300}Zoho Desk.{0,300}/)||[t.slice(-600)])[0]);
};
