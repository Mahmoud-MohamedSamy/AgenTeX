out.loaded=await openTicket();await wt(/QA FT 1865 H comment 2/);await page.waitForTimeout(2000);
await page.locator('button:has-text("Reply All")').first().click();await wt(/Write your reply|wrote:/);await page.waitForTimeout(3000);
const ri=page.locator('input[placeholder="Add a recipient"]').first();
const t0=await body();out.recips0=t0.slice(t0.indexOf('Recipients'),t0.indexOf('Subject')).replace(/\n/g,' | ');
if(!/Recipients \| mmohamed/.test(out.recips0)&&await ri.count()){await ri.click();await ri.type('mmohamed@anyware.software');await page.keyboard.press('Enter');await page.waitForTimeout(1000);}
const ccx=page.locator('button[aria-label*="Remove mmohamed" i]');if(await ccx.count()>1){await ccx.nth(1).click();await page.waitForTimeout(800);}
const t=await body();out.recips=t.slice(t.indexOf('Recipients'),t.indexOf('Subject')).replace(/\n/g,' | ');
await page.locator('button[aria-label="More send options"]').click();await page.waitForTimeout(1000);
await page.locator('[role=menuitem]:text-is("Schedule")').click();await page.waitForTimeout(2500);
const dlg=page.locator('[role=dialog]').last();await dlg.scrollIntoViewIfNeeded().catch(()=>{});
out.dialogText=(await dlg.innerText()).replace(/\n/g,' | ').slice(0,600);await dlg.screenshot({path:D+'s2-schedule-dialog.png'}).catch(e=>out.dshot=String(e).slice(0,80));
await dlg.locator('button:text-is("Schedule")').click();await page.waitForTimeout(6000);
out.after=await lines(/schedul/i,8);await shot('s3-after-schedule');
const sr=await api('GET','/desk/scheduled-replies');out.list=sr.s+' '+JSON.stringify((sr.j&&sr.j.data&&sr.j.data.scheduled_replies||[]).map(x=>({id:x.id,at:x.scheduled_at||x.send_at,st:x.status,to:x.to||x.recipients}))).slice(0,600);
const mine=(sr.j&&sr.j.data&&sr.j.data.scheduled_replies||[]).filter(x=>JSON.stringify(x).includes('5254adb3'));if(mine.length)log('CREATED scheduled reply '+mine.map(x=>x.id).join(',')+' on ticket #2484 to mmohamed@anyware.software (to be cancelled)');
return Object.assign(out,{calls:[...new Set(calls)]});
