async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const ca=page.getByText('Clear All',{exact:true});if(await ca.count())await ca.first().click().catch(()=>{});await page.waitForTimeout(800);
await page.mouse.click(660,696);await page.waitForTimeout(2500);await page.screenshot({path:R+'zd-imp-t.png'});
const v=await page.evaluate(()=>[...document.querySelectorAll('li,div,span')].filter(e=>e.children.length===0&&e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim(),Math.round(r.x),Math.round(r.y)];}).filter(a=>a[1]>600&&a[1]<800&&a[0]&&!/@/.test(a[0])));return JSON.stringify(v.slice(0,30));}
