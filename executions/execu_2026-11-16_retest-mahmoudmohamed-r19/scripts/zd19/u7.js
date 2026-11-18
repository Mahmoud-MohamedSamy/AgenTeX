async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.mouse.click(866,471);await page.waitForTimeout(6000);await page.screenshot({path:R+'ZD-2841-2.png'});
const t=await page.innerText('body');const i=t.indexOf('Support Plan');return t.slice(Math.max(0,i)).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,1500);}
