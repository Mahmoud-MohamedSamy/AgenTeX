async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const pick=async(name)=>{const o=page.getByText(name,{exact:true});const n=await o.count();for(let i=n-1;i>=0;i--){if(await o.nth(i).isVisible()){await o.nth(i).click();return n;}}return 0;};
const r1=await pick('Owner');await page.waitForTimeout(2000);
await page.mouse.click(705,664);await page.waitForTimeout(2500);const r2=await pick('Department');await page.waitForTimeout(2000);
await page.mouse.click(705,768);await page.waitForTimeout(2500);const r3=await pick('Contact');await page.waitForTimeout(2500);
await page.screenshot({path:R+'zd-imp-f.png'});const t=await page.innerText('body');return [r1,r2,r3].join(',')+'\n'+t.slice(Math.max(0,t.indexOf('SAMPLE DATA'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,1500);}
