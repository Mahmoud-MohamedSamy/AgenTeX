async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.mouse.click(680,667);await page.waitForTimeout(2500);
const vis=await page.evaluate(()=>[...document.querySelectorAll('li,div,span')].filter(e=>e.children.length===0&&e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim(),Math.round(r.x),Math.round(r.y)];}).filter(a=>a[1]>630&&a[1]<800&&a[2]>560&&a[2]<900&&a[0]&&!/@/.test(a[0])).map(a=>a.join('@')));
await page.screenshot({path:R+'zd-imp-i.png'});return vis.join(' | ');}
