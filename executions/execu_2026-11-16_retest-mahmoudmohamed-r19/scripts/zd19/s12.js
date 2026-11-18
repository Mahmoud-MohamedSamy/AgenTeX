async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.mouse.click(690,741);await page.waitForTimeout(3000);await page.mouse.click(1500,460);await page.waitForTimeout(1500);
await page.screenshot({path:R+'ZD-3-3.png'});
const btns=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>b.textContent.trim()+'@'+Math.round(b.getBoundingClientRect().x)+','+Math.round(b.getBoundingClientRect().y)));
return btns.join(' | ');}
