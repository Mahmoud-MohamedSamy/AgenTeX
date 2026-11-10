const sr=await api('GET','/desk/scheduled-replies');out.list=sr.s+' '+JSON.stringify(sr.j&&sr.j.data).slice(0,800);
out.loaded=await openTicket();await wt(/QA FT 1865 H comment 2/);await page.waitForTimeout(2000);
let step='replyAll';try{
await page.locator('button:has-text("Reply All")').first().click();await wt(/Write your reply|wrote:/);await page.waitForTimeout(3000);
step='recips';const t0=await body();out.recips0=t0.slice(t0.indexOf('Recipients'),t0.indexOf('Subject')).replace(/\n/g,' | ');
const ri=page.locator('input[placeholder="Add a recipient"]').first();
if(!/Recipients \| mmohamed/.test(out.recips0)&&await ri.count()){await ri.click();await ri.type('mmohamed@anyware.software');await page.keyboard.press('Enter');await page.waitForTimeout(1000);}
const ccx=page.locator('button[aria-label*="Remove mmohamed" i]');out.chips=await ccx.count();if(out.chips>1){await ccx.nth(1).click();await page.waitForTimeout(800);}
const t=await body();out.recips=t.slice(t.indexOf('Recipients'),t.indexOf('Subject')).replace(/\n/g,' | ');
step='menu';await page.locator('button[aria-label="More send options"]').click({timeout:10000});await page.waitForTimeout(1000);
step='schedItem';await page.locator('[role=menuitem]:text-is("Schedule")').click({timeout:10000});await page.waitForTimeout(2500);
step='dialog';const dlg=page.locator('[role=dialog]').last();out.dialogText=(await dlg.innerText()).replace(/\n/g,' | ').slice(0,700);
await dlg.screenshot({path:D+'s2-schedule-dialog.png'}).catch(e=>out.dshot=String(e).slice(0,80));
}catch(e){out.err=step+': '+String(e).slice(0,120);await shot('s-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
