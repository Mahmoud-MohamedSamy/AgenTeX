const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/evidence/skills/';
await page.setViewportSize({width:1280,height:900});
await page.goto(H+'/views/all/tickets/45d760e1-997b-4925-8323-e543f887a2d4',{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
const sk=page.getByText('Skills',{exact:true}).first();
const info=await sk.evaluate(e=>{let p=e;for(let i=0;i<4&&p.parentElement;i++)p=p.parentElement;return {tag:e.tagName,box:e.getBoundingClientRect().toJSON(),ctx:p.innerText.slice(0,300)}});
await sk.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
await page.screenshot({path:D+'tavi-skills-field.png'});
// rail icons
await page.mouse.click(341,127);await page.waitForTimeout(3000);await page.screenshot({path:D+'tavi-rail-ai.png'});
const railTxt=await page.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.x>320&&r.x<362&&r.y>60&&r.y<400&&r.width<44&&r.width>16&&(e.getAttribute('aria-label')||e.getAttribute('title')||e.getAttribute('data-testid'))}).map(e=>[e.tagName,e.getAttribute('aria-label'),e.getAttribute('title'),e.getAttribute('data-testid')]));
return {info,railTxt};
