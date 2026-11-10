out.loaded=await openTicket();await wt(/Scheduled/);await page.waitForTimeout(2000);
let step='kebab';try{
const card=page.locator('div').filter({hasText:/^Scheduled/}).first();
await page.mouse.click(1396,229);await page.waitForTimeout(1500);
out.menu=(await page.locator('[role=menu]').allInnerTexts()).slice(0,3);await shot('s4-scheduled-menu');
step='cancel';const it=page.locator('[role=menuitem]').filter({hasText:/cancel|delete|discard/i}).first();out.item=await it.innerText();await it.click({timeout:10000});await page.waitForTimeout(2000);
const dlg=page.locator('[role=dialog], [role=alertdialog]').last();if(await dlg.count()){out.confirm=(await dlg.innerText()).replace(/\n/g,' | ').slice(0,200);const b=dlg.getByRole('button').filter({hasText:/cancel (reply|scheduled)|yes|confirm|delete|discard/i}).last();out.confirmBtn=await b.innerText().catch(()=>null);await b.click({timeout:10000});}
await page.waitForTimeout(5000);await shot('s5-after-cancel');
const sr=await api('GET','/desk/scheduled-replies');out.listAfter=JSON.stringify((sr.j&&sr.j.data&&sr.j.data.scheduled_replies)||[]).slice(0,300);
const one=await api('GET','/desk/tickets/5254adb3-80f2-4c12-9c6e-e7e7a1c7150a/scheduled-replies');out.ticketSched=one.s+' '+one.t.slice(0,300);
log('CANCEL scheduled reply 01a1c520-468a-7955-995f-18845cfc08b6 via UI ('+out.item+')');
}catch(e){out.err=step+': '+String(e).slice(0,140);await shot('s-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
