async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.mouse.click(1233,23);await page.waitForTimeout(6000);
let t=await page.innerText('body');await page.screenshot({path:R+'zd-c-2.png'});
const vis=await page.evaluate(()=>[...document.querySelectorAll('label,span,div,input,button')].filter(e=>e.offsetParent&&e.children.length===0&&e.textContent.trim()).map(e=>{const r=e.getBoundingClientRect();return e.textContent.trim().slice(0,40)+'@'+Math.round(r.x)+','+Math.round(r.y);}).filter(s=>!/@.*@/.test(s)));
return page.url()+'\n'+vis.slice(0,120).join(' | ');}
