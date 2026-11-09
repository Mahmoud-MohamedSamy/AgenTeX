const o={};const S='../screenshots/';
await page.setViewportSize({width:1600,height:1000});
await page.goto(H+'/settings/security/audit-log',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForTimeout(8000);
await page.getByText('Any time',{exact:true}).first().click();await page.waitForTimeout(800);
await page.getByText('Custom range',{exact:true}).first().click();await page.waitForTimeout(1500);
const d=page.locator('input[type=date]:visible');await d.nth(0).fill('2026-11-04');await d.nth(1).fill('2026-11-04');await page.waitForTimeout(6000);
await page.keyboard.press('Escape');await page.waitForTimeout(800);
const t=await page.innerText('body');const lines=t.split('\n');const conv=[];for(let i=0;i<lines.length;i++){if(/conversion report/i.test(lines[i]))conv.push(lines[i].slice(0,260));}
o.n=conv.length;o.lines=conv.filter(x=>!/'s ID from/.test(x));
const cs=page.getByText(/Assignment conversion report .*Customer Support/).first();
if(await cs.count()){await cs.scrollIntoViewIfNeeded();await page.mouse.wheel(0,-250);await page.waitForTimeout(800);await page.screenshot({path:S+'ui-J03-dept-entry.png'});
 await cs.click().catch(()=>{});await page.waitForTimeout(2500);o.after=(await page.innerText('body')).match(/Customer Support[\s\S]{0,900}/g)?.slice(-1)[0];await page.screenshot({path:S+'ui-J03-dept-entry-open.png'});}
const r1=page.getByText(/Assignment conversion report updated QA NDC RR manual invoice 1's type/).first();if(await r1.count()){await r1.scrollIntoViewIfNeeded();await page.waitForTimeout(500);await page.screenshot({path:S+'ui-J03-rule-entries.png'});}
return o;
