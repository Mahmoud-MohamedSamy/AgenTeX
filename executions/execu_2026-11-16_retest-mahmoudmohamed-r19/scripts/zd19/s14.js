async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.screenshot({path:R+'zd-imp-k.png'});
const vis=await page.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.offsetParent&&/rimary|mandatory|required/i.test(e.textContent)).map(e=>e.textContent.trim().slice(0,200)));
return vis.join(' | ');}
