async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const v=await page.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.offsetParent&&/Start Import/.test(e.textContent)&&[...e.children].every(c=>!/Start Import/.test(c.textContent))).map(e=>{const r=e.getBoundingClientRect();return e.tagName+'|'+JSON.stringify(e.textContent)+'|'+[r.x,r.y,r.width,r.height].map(Math.round)}));
await page.screenshot({path:R+'ZD-3-4.png'});return v.join('\n');}
