async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const sm=page.locator('text=Select Modules').first();const bb=await sm.boundingBox();await page.mouse.click(bb.x+150,bb.y+bb.height+20);await page.waitForTimeout(3000);
const opts=await page.locator('text=Tickets').count();const t1=await page.innerText('body');
const tk=page.locator('li:has-text("Tickets"), [role=option]:has-text("Tickets")');const n=await tk.count();if(n){await tk.first().click();await page.waitForTimeout(2000);}
await page.keyboard.press('Escape');await page.waitForTimeout(1500);
await page.locator('input[type=file]').first().setInputFiles('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/imp/Tickets.csv');await page.waitForTimeout(6000);
await page.screenshot({path:R+'zd-imp-b.png'});const t=await page.innerText('body');return 'opts '+n+'\n'+t.slice(Math.max(0,t.indexOf('Modules'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,1500);}
