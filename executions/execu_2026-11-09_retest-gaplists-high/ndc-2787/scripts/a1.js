await page.setViewportSize({width:1600,height:1000});
await page.goto(H+'/settings',{waitUntil:'load',timeout:120000});await page.waitForTimeout(9000);
const url=page.url();
const links=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>[a.innerText.trim().replace(/\s+/g,' '),a.getAttribute('href')]).filter(x=>x[1].startsWith('/settings')));
await page.screenshot({path:'evidence/raw/settings-home.png',fullPage:true});
const body=(await page.locator('body').innerText()).slice(0,6000);
return {url,n:links.length,links,body};
