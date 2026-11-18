await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded'});await sleep(15000);
log(page.url());
log(JSON.stringify(await page.locator('#main-content button').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||'')+'|'+x.innerText.trim().slice(0,30)).filter(s=>s!=='|').slice(0,60))));
await shot('2832-x0.png');
