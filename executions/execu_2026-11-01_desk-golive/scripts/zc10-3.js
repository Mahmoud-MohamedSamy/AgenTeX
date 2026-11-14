async (page) => {
  await page.getByText('Data Sharing', {exact:true}).first().click();
  let t=''; for (let i=0;i<30;i++){ await page.waitForTimeout(1500); t=(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' '); if (/Private|Public/.test(t) && /Tickets/.test(t)) break; }
  await page.screenshot({path:'evidence/zoho-c10/data-sharing-before.png'});
  const i = t.indexOf('Data Sharing'); return {url:page.url(), t:t.slice(Math.max(0,t.lastIndexOf('Data Sharing')-50), t.lastIndexOf('Data Sharing')+1500)};
}
