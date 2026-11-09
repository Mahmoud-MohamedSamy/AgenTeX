const out={};await page.setViewportSize({width:1600,height:1000});
await page.goto(H+'/views/all/tickets/617328b7-0b3c-4230-be13-1437c609d88b',{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
for(const y of [127,171]){await page.mouse.click(341,y);await page.waitForTimeout(5000);
 const panel=await page.evaluate(()=>[...document.querySelectorAll('*')].filter(x=>{const r=x.getBoundingClientRect();return r.x>365&&r.x<660&&r.y>60&&r.y<800&&x.children.length===0&&x.innerText&&x.innerText.trim()}).map(x=>x.innerText.trim()).slice(0,30).join(' | '));
 out['y'+y]=panel;await page.screenshot({path:'evidence/raw/rail-'+y+'.png'});}
return out;
