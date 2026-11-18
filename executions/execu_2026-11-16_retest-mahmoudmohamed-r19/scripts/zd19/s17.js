async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const ca=page.getByText('Clear All',{exact:true});if(await ca.count())await ca.first().click().catch(()=>{});await page.waitForTimeout(1000);
const vis=async()=>page.evaluate(()=>[...document.querySelectorAll('li,div,span')].filter(e=>e.children.length===0&&e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim(),Math.round(r.x),Math.round(r.y)];}).filter(a=>a[1]>630&&a[1]<800&&a[2]>300&&a[0]&&!/@/.test(a[0])));
await page.mouse.click(705,644);await page.waitForTimeout(2500);let v=await vis();const back=v.find(a=>a[0]==='Department'&&a[1]>670);if(back){await page.mouse.click(back[1]-20,back[2]+7);await page.waitForTimeout(2000);}
v=await vis();const none=v.find(a=>a[0]==='None'&&a[2]>600);if(none){await page.mouse.click(none[1]+10,none[2]+7);await page.waitForTimeout(2000);}
await page.locator('button',{hasText:/^Save$/}).first().click();
let t='';for(let k=0;k<30;k++){await page.waitForTimeout(3000);t=await page.innerText('body');if(/Start Import/.test(t)||/not present|error/i.test(t))break;}
await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-imp-n.png'});t=await page.innerText('body');
return JSON.stringify(v.slice(0,4))+'\n'+t.slice(Math.max(0,t.indexOf('Review'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,1500);}
