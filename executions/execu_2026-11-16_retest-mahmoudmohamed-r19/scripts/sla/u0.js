await page.goto(H+'/setup',{waitUntil:'domcontentloaded'});await sleep(6000);
const links=await page.$$eval('a',as=>as.map(a=>a.getAttribute('href')+' | '+a.innerText.trim().slice(0,40)).filter(x=>/sla|plan|contract|template/i.test(x)));log(page.url());log(JSON.stringify(links));
