async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const vis=async()=>page.evaluate(()=>[...document.querySelectorAll('li,div,span')].filter(e=>e.children.length===0&&e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim(),Math.round(r.x),Math.round(r.y)];}).filter(a=>a[1]>630&&a[1]<800&&a[2]>100&&a[0]&&!/@/.test(a[0])));
const pick=async(name)=>{const v=await vis();const d=v.find(a=>a[0]===name);if(!d)return 'no '+name;await page.mouse.click(d[1]+10,d[2]+7);await page.waitForTimeout(2200);return 'ok';};
const r=[];r.push(await pick('Contact'));r.push(await pick('Contact Email ID'));
await page.mouse.click(660,748);await page.waitForTimeout(2500);r.push(await pick('Contact'));r.push(await pick('Contact Last Name'));
await page.mouse.click(660,644);await page.waitForTimeout(2500);r.push(await pick('Department'));r.push(await pick('Department Name'));
await page.mouse.click(1500,440);await page.waitForTimeout(1000);await page.screenshot({path:R+'zd-imp-u.png'});return r.join(',');}
