const id='fffcde56-f91b-40f9-a22b-7cd894a77921';
await openTicket(id,'QA RC 1865 API ticket');await wt(/QA RC 1865 reply 1/,60000);await page.waitForTimeout(2500);
// existing draft? discard via composer Cancel
const arrow=page.locator('button:has-text("Reply All")').first().locator('xpath=following-sibling::button[1]');
await arrow.click();await page.waitForTimeout(1500);await page.locator('[role=menuitem]:has-text("Reply")').filter({hasNotText:'All'}).first().click();await wt(/Insert template/);await page.waitForTimeout(3500);
out.replyOnly=await composerInfo();await shot('b2-api-reply-only-after-reply1');
// discard
const cancel=page.locator('button:has-text("Cancel")').last();await cancel.click();await page.waitForTimeout(1500);
const dlg=page.locator('[role=dialog],[role=alertdialog]').last();if(await dlg.count()){out.dlg=(await dlg.innerText()).replace(/\n/g,' | ').slice(0,200);const b=dlg.getByRole('button').filter({hasText:/discard|yes|delete/i}).first();if(await b.count())await b.click();await page.waitForTimeout(1500);}
const dr=await api('GET',`/desk/tickets/${id}/drafts/mine`);out.draftAfter=dr.s+' '+dr.t.slice(0,150);
// try New Ticket page
for(const p of ['/tickets/new','/views/all/tickets/new','/tickets/create']){await page.goto(H+p,{waitUntil:'commit',timeout:120000});const t=await wt(/Create Ticket|Not found|404/,40000);out['page '+p]=t?(/Create Ticket/.test(t)?'create form':'no'):'timeout';if(t&&/Create Ticket/.test(t))break;}
await shot('b1-ui-create-form-empty');
out.formLines=(await body()).split('\n').filter(l=>/Department|Contact|Subject|Status|Owner|Email|Phone/.test(l)).slice(0,15);
return Object.assign(out,{calls:[...new Set(calls)]});
