async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const ca=page.getByText('Clear All',{exact:true});if(await ca.count())await ca.first().click().catch(()=>{});await page.waitForTimeout(1000);
await page.mouse.click(437,299);await page.waitForTimeout(1500);
await page.mouse.click(836,371);await page.waitForTimeout(2500);
const v=await page.evaluate(()=>[...document.querySelectorAll('li,div,span')].filter(e=>e.children.length===0&&e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim(),Math.round(r.x),Math.round(r.y)];}).filter(a=>a[1]>700&&a[1]<1000&&a[2]>380&&a[2]<600&&a[0]));
const none=v.find(a=>a[0]==='None');if(none){await page.mouse.click(none[1]+10,none[2]+7);await page.waitForTimeout(2000);}
await page.screenshot({path:R+'zd-imp-o.png'});return JSON.stringify(v);}
