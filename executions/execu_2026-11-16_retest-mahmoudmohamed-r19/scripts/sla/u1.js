await page.goto(H+'/settings',{waitUntil:'domcontentloaded'});await sleep(7000);
const links=await page.$$eval('a',as=>as.map(a=>a.getAttribute('href')).filter(x=>x&&x.startsWith('/settings')));log(page.url());log(JSON.stringify([...new Set(links)]));
