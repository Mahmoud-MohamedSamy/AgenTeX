const out={};await page.setViewportSize({width:1600,height:1000});
const reqs=[];page.on('response',r=>{const u=r.url();if(/\/api\/v1\/(iam|desk)\//.test(u)&&!/\/iam\/auth/.test(u))reqs.push(r.status()+' '+u.replace(/^.*\/api\/v1/,''))});
await page.goto(H+'/settings',{waitUntil:'load',timeout:120000});await page.waitForTimeout(6000);
await page.getByText('Agents',{exact:true}).first().click();await page.waitForTimeout(12000);
out.url=page.url();let t=await page.locator('body').innerText();out.txt=t.slice(t.lastIndexOf('Email Providers')+15).replace(/\n+/g,' | ').slice(0,1500);
await page.screenshot({path:'evidence/raw/agents-list.png'});
// scroll to bottom
await page.mouse.wheel(0,20000);await page.waitForTimeout(4000);await page.mouse.wheel(0,20000);await page.waitForTimeout(4000);
t=await page.locator('body').innerText();out.tail=t.slice(-800).replace(/\n+/g,' | ');
await page.screenshot({path:'evidence/raw/agents-list-bottom.png'});
out.reqs=[...new Set(reqs)].slice(0,30);
return out;
