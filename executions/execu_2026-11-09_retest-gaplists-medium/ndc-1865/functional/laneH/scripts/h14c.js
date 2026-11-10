out.loaded=await openTicket();await wt(/QA FT 1865 H comment 2/);await page.waitForTimeout(2000);
let step='replyAll';try{
await page.locator('button:has-text("Reply All")').first().click();await wt(/Write your reply|wrote:/);await page.waitForTimeout(3000);
step='recips';const t0=await body();out.recips0=t0.slice(t0.indexOf('Recipients'),t0.indexOf('Subject')).replace(/\n/g,' | ');
const ri=page.locator('input[placeholder="Add a recipient"]').first();
if(!/Recipients \| mmohamed/.test(out.recips0)&&await ri.count()){await ri.click();await ri.type('mmohamed@anyware.software');await page.keyboard.press('Enter');await page.waitForTimeout(1000);}
const ccx=page.locator('button[aria-label*="Remove mmohamed" i]');out.chips=await ccx.count();if(out.chips>1){await ccx.nth(1).click();await page.waitForTimeout(800);}
const t=await body();out.recips=t.slice(t.indexOf('Recipients'),t.indexOf('Subject')).replace(/\n/g,' | ');
if(!/Recipients \| mmohamed@anyware\.software \| Bcc \| Cc \| $/.test(out.recips)){out.abort='recipients not as expected';return out;}
step='menu';await page.locator('button[aria-label="More send options"]').click({timeout:10000});await page.waitForTimeout(1000);
step='schedItem';await page.locator('[role=menuitem]:text-is("Schedule")').click({timeout:10000});await page.waitForTimeout(2500);
step='dialog';const dlg=page.locator('[role=dialog]').filter({hasText:'Schedule this reply'}).last();
step='pick12h';await dlg.getByText('In 12 hours',{exact:true}).click({timeout:10000});await page.waitForTimeout(800);
out.dialog=(await dlg.innerText()).replace(/\n/g,' | ').slice(0,300);await dlg.screenshot({path:D+'s2-schedule-dialog.png'}).catch(()=>{});
if(!/Sends Nov 11/.test(out.dialog)){out.abort='time not 12h ahead';return out;}
step='schedule';const btns=dlg.getByRole('button',{name:'Schedule',exact:true});out.schedBtns=await btns.count();await btns.last().click({timeout:10000});await page.waitForTimeout(6000);await shot('s3-after-schedule');
const sr2=await api('GET','/desk/scheduled-replies');const L2=(sr2.j&&sr2.j.data&&sr2.j.data.scheduled_replies)||[];out.list2=JSON.stringify(L2).slice(0,700);
const mine=L2.filter(x=>JSON.stringify(x).includes('5254adb3'));if(mine.length)log('CREATED scheduled reply '+mine.map(x=>x.id).join(',')+' on ticket #2484 To mmohamed@anyware.software, In 12 hours (to be cancelled)');
}catch(e){out.err=step+': '+String(e).slice(0,120);await shot('s-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
