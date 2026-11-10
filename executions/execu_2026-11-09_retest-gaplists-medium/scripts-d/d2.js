const reqs=[];page.on('request',r=>{const u=r.url();if(u.includes('/api/v1/')&&!u.includes('/iam/auth'))reqs.push(r.method()+' '+u.split('/api/v1')[1].slice(0,140));});
await page.route('**/api/v1/**',r=>{const m=r.request().method();if(m!=='GET'&&!r.request().url().includes('/iam/auth'))return r.abort();return r.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/settings',{waitUntil:'load',timeout:120000});await page.waitForTimeout(9000);
const links=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>[a.innerText.trim().slice(0,40),a.getAttribute('href')]).filter(x=>/skill|approv|assign|automation|workflow|blueprint|depart/i.test(x.join(' '))));
return {url:page.url(),links,reqs:[...new Set(reqs)].slice(0,30)};
