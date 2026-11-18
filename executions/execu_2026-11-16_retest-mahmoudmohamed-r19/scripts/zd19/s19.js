async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
// re-map Department -> Department Name
const vis=async(x1,x2,y1)=>page.evaluate(([x1,x2,y1])=>[...document.querySelectorAll('li,div,span')].filter(e=>e.children.length===0&&e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim(),Math.round(r.x),Math.round(r.y)];}).filter(a=>a[1]>x1&&a[1]<x2&&a[2]>y1&&a[0]&&!/@/.test(a[0])),[x1,x2,y1]);
await page.mouse.click(705,644);await page.waitForTimeout(2500);let v=await vis(630,800,600);let d=v.find(a=>a[0]==='Department');if(d){await page.mouse.click(d[1]+10,d[2]+7);await page.waitForTimeout(2000);}
v=await vis(630,800,600);d=v.find(a=>a[0]==='Department Name');if(d){await page.mouse.click(d[1]+10,d[2]+7);await page.waitForTimeout(2000);}
await page.mouse.click(1500,440);await page.waitForTimeout(1000);
await page.screenshot({path:R+'ZD-3-3.png'});
await page.locator('button',{hasText:/^Save$/}).first().click();
let t='';for(let k=0;k<30;k++){await page.waitForTimeout(3000);t=await page.innerText('body');if(/Start Import/.test(t)||/not present|error/i.test(t))break;}
await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-imp-p.png'});t=await page.innerText('body');
return t.slice(Math.max(0,t.indexOf('Review'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2000);}
