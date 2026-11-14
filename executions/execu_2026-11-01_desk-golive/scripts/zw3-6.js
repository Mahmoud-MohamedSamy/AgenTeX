async (page) => {
  const urls = []; const h = req => { const u=req.url(); if (/api\/v1|supportapi/.test(u)) urls.push(req.method()+' '+u.slice(0,160)); };
  page.on('request', h);
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/contracts/list',{waitUntil:'domcontentloaded'}).catch(()=>{});
  for (let i=0;i<20;i++){ await page.waitForTimeout(1000); }
  page.off('request', h);
  await page.screenshot({path:'evidence/zoho-w3/z-contracts.png'});
  return {url: page.url(), urls: [...new Set(urls)].slice(0,25), t:(await page.innerText('body')).replace(/\s+/g,' ').replace(/Your free trial.*?Purchase a license/,'').slice(0,800)};
}
