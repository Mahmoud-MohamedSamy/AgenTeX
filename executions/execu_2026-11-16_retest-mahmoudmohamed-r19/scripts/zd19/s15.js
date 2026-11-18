async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.mouse.click(705,748);await page.waitForTimeout(2500);
let vis=await page.evaluate(()=>[...document.querySelectorAll('li,div,span')].filter(e=>e.children.length===0&&e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim(),Math.round(r.x),Math.round(r.y)];}).filter(a=>a[1]>630&&a[1]<800&&a[2]>300&&a[0]&&!/@/.test(a[0])));
const back=vis.find(a=>a[0]==='Contact');if(back){await page.mouse.click(back[1]-20,back[2]+7);await page.waitForTimeout(2000);}
vis=await page.evaluate(()=>[...document.querySelectorAll('li,div,span')].filter(e=>e.children.length===0&&e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim(),Math.round(r.x),Math.round(r.y)];}).filter(a=>a[1]>630&&a[1]<800&&a[2]>300&&a[0]&&!/@/.test(a[0])));
const none=vis.find(a=>a[0]==='None');if(none){await page.mouse.click(none[1]+10,none[2]+7);await page.waitForTimeout(2000);}
await page.locator('button',{hasText:/^Save$/}).first().click();
let t='';for(let k=0;k<30;k++){await page.waitForTimeout(3000);t=await page.innerText('body');if(/Start Import/.test(t)||/not present|error/i.test(t))break;}
await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-imp-l.png'});t=await page.innerText('body');
return JSON.stringify(vis.slice(0,6))+'\n'+t.slice(Math.max(0,t.indexOf('Review'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2000);}
