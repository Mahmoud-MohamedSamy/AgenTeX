async (page) => {
  await page.locator('div.zd_v2-typography-dotted:visible').filter({hasText:/^Private$/}).first().click(); await page.waitForTimeout(1500);
  const first = (await page.locator('[class*=accessdropd]').first().innerText()).trim();
  await page.screenshot({path:'evidence/zoho-c10/data-sharing-private-before-update.png'});
  let res='not saved';
  if (first==='Private') { await page.getByRole('button',{name:'Update'}).click(); await page.waitForTimeout(3000);
    const t0=(await page.innerText('body')).replace(/\s+/g,' '); const m=t0.match(/.{0,200}(confirm|Are you sure|sure).{0,300}/i); res = m? 'confirm: '+m[0] : 'clicked';
    if (m) { const b = page.getByRole('button',{name:/^(Yes|Update|Proceed|Confirm|OK|Continue)/}).last(); res += ' | btn '+(await b.innerText().catch(()=>'?')); await b.click().catch(()=>{}); await page.waitForTimeout(4000); } }
  let t=''; for (let i=0;i<10;i++){ await page.waitForTimeout(1500); t=(await page.innerText('body')).replace(/\s+/g,' '); if (!/UpdateCancel/.test(t)) break; }
  await page.screenshot({path:'evidence/zoho-c10/data-sharing-after.png'});
  return {first, res, t:t.slice(t.indexOf('MODULE'),t.indexOf('MODULE')+300)};
}
