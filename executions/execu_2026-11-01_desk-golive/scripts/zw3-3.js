async (page) => {
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-cases',{waitUntil:'domcontentloaded'});
  for (let i=0;i<30;i++){ await page.waitForTimeout(1000); if ((await page.innerText('body').catch(()=>'')).length>800) break; }
  const cands = await page.locator('[aria-label*="etup" i],[title*="etup" i],[data-id*="setup" i],a[href*="setup"]').evaluateAll(es=>es.map(e=>[e.tagName,e.getAttribute('aria-label'),e.getAttribute('title'),e.getAttribute('href'),e.getAttribute('data-id')].join('|')).slice(0,10));
  const s = page.locator('[aria-label*="etup" i],[title*="etup" i],a[href*="setup"]').first();
  if (await s.count()) { await s.click().catch(()=>{}); }
  for (let i=0;i<40;i++){ await page.waitForTimeout(1500); const t=await page.innerText('body').catch(()=>''); if (/Profiles|Users and Control|Automation/i.test(t)) break; }
  await page.screenshot({path:'evidence/zoho-w3/z-setup.png'});
  return {cands, url: page.url(), t:(await page.innerText('body')).replace(/\s+/g,' ').slice(0,2500)};
}
