async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.mouse.move(722,445);await page.waitForTimeout(2500);await page.screenshot({path:R+'ZD-2841-0.png'});
const tip=await page.evaluate(()=>[...document.querySelectorAll('div,span')].filter(e=>e.offsetParent&&e.children.length===0&&/plan/i.test(e.textContent)&&e.textContent.length>25).map(e=>e.textContent.trim().slice(0,250)));
await page.mouse.click(747,472);await page.waitForTimeout(4000);await page.screenshot({path:R+'ZD-2841-1.png'});
const vis=await page.evaluate(()=>[...document.querySelectorAll('li,div,span')].filter(e=>e.offsetParent&&e.children.length===0&&e.textContent.trim()).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim().slice(0,60),Math.round(r.x),Math.round(r.y)];}).filter(a=>a[2]>440&&a[2]<800&&a[1]>600&&a[1]<1000).map(a=>a.join('@')));
return 'TIP '+JSON.stringify(tip)+'\n'+vis.join(' | ');}
