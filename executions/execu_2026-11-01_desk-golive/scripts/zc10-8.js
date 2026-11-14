async (page) => {
  await page.locator('[class*=accessdropd]').first().click(); await page.waitForTimeout(1500);
  const opts = (await page.locator('[role=option]:visible,li:visible').allInnerTexts()).map(s=>s.trim()).filter(s=>/Private|Public|Read/.test(s));
  await page.locator('[role=option]:visible,li:visible').filter({hasText:/^\s*Private\s*$/}).first().click(); await page.waitForTimeout(1500);
  const first = (await page.locator('[class*=accessdropd]').first().innerText()).trim();
  await page.screenshot({path:'evidence/zoho-c10/data-sharing-private-before-update.png'});
  if (first==='Private') { await page.getByRole('button',{name:'Update'}).click(); await page.waitForTimeout(4000); }
  let t=''; for (let i=0;i<10;i++){ await page.waitForTimeout(1500); t=(await page.innerText('body')).replace(/\s+/g,' '); if (!/UpdateCancel/.test(t)) break; }
  await page.screenshot({path:'evidence/zoho-c10/data-sharing-after.png'});
  return {opts, first, t:t.slice(t.indexOf('MODULE'),t.indexOf('MODULE')+300)};
}
