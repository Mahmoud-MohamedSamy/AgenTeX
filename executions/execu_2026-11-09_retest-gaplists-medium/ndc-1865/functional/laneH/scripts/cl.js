// Cleanup: import session via UI "Start over", then delete ledger records, purge bin by id, verify.
const TK='88e8ea44-1658-4df3-9930-d0902b91073d',CT='43004ce2-577f-4eda-b00a-0750fe40c3d4',EV='6fb19115-9356-40f0-b064-840d8f1fad93',TM='d120a6c2-2596-4254-968b-a1bcd3a000bf',CL='f7e488b5-0232-42fd-811c-1f24356af653';
let step='import';try{
await page.goto(H+'/settings/data/import',{waitUntil:'load',timeout:120000});await wt(/Choose a module/);await page.waitForTimeout(2000);
await page.getByText('Choose a module').nth(1).click();await page.waitForTimeout(1000);await page.locator('[role=option]').filter({hasText:/^Contacts$/}).first().click();await page.waitForTimeout(800);
await page.getByRole('button',{name:'Start import'}).click();await page.waitForTimeout(6000);
out.banner=/import in progress/i.test(await body());
if(out.banner){await page.getByRole('button',{name:'Start over'}).click({timeout:10000});await page.waitForTimeout(3000);const d=page.locator('[role=dialog],[role=alertdialog]').filter({hasText:/start over|discard|lose/i}).last();if(await d.count()){out.soConfirm=(await d.innerText()).replace(/\n/g,' | ').slice(0,200);await d.getByRole('button').filter({hasText:/start over|discard|yes|confirm/i}).last().click().catch(()=>{});}await page.waitForTimeout(3000);}
await page.keyboard.press('Escape').catch(()=>{});await page.waitForTimeout(1000);
await page.goto(H+'/settings/data/import',{waitUntil:'load',timeout:120000});await page.waitForTimeout(5000);await page.getByText('Choose a module').nth(1).click();await page.waitForTimeout(1000);await page.locator('[role=option]').filter({hasText:/^Contacts$/}).first().click();await page.getByRole('button',{name:'Start import'}).click();await page.waitForTimeout(6000);out.bannerAfter=/import in progress/i.test(await body());await shot('cl-import-after');
log('IMPORT session cleanup via UI Start over: banner before='+out.banner+' after='+out.bannerAfter);
}catch(e){out.err=step+': '+String(e).slice(0,140);}
const R=[[TM,'615ea9fb-e84b-4a10-8890-5c0d82c3de60','task'],[CL,'c1c8cb5d-d469-4769-8930-9a623cba4072','call'],[EV,'6b4edebe-109d-4c22-a2af-51be30b6403b','event'],[TK,'5254adb3-80f2-4c12-9c6e-e7e7a1c7150a','ticket'],[CT,'f925d891-f557-409c-be3f-1043738b6dd8','contact']];
out.del={};for(const [m,id,k] of R){const d=await api('DELETE',`/modules/${m}/records/${id}`);out.del[k]=d.s;log(`DELETE ${k} ${id} → ${d.s}`);}
const t1=await api('DELETE','/desk/email-templates/13f963bc-3bc1-4487-9634-bb338e04d383');out.del.template=t1.s;log(`DELETE email template 13f963bc → ${t1.s}`);
const f1=await api('DELETE','/desk/email-templates/folders/58e55582-0908-4edf-b1b9-e09a56ee2149');out.del.folder=f1.s;log(`DELETE template folder 58e55582 → ${f1.s}`);
await sleep(4000);
const ids=R.map(r=>r[1]);const bin=arr((await api('GET','/audit/recycle-bin/items')).j);const mine=bin.filter(i=>ids.includes(i.record_id));out.binMatches=mine.length;
if(mine.length){const p=await api('POST','/audit/recycle-bin/delete',{ids:mine.map(i=>i.id)});out.purge=p.s;log(`PURGE bin ids ${mine.map(i=>i.id).join(',')} → ${p.s}`);}
await sleep(3000);
out.verify=[];for(const [m,id,k] of R)out.verify.push(k+' '+(await api('GET',`/modules/${m}/records/${id}`)).s);
out.verify.push('template '+(await api('GET','/desk/email-templates/13f963bc-3bc1-4487-9634-bb338e04d383')).s);
const fl=JSON.stringify((await api('GET','/desk/email-templates/folders')).j);out.folderGone=!fl.includes('58e55582');
const bin2=arr((await api('GET','/audit/recycle-bin/items')).j);out.binLeft=bin2.filter(i=>ids.includes(i.record_id)||/QA FT 1865 H/.test(JSON.stringify(i))).length;
// CRM side of the synced contact
const tok=(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token');
for(const host of ['https://staging-crm.taviportal.com','https://staging-desk.taviportal.com']){const r=await ctx.request.fetch(host+'/api/v1/modules/contacts/records/8f791451-29bf-486a-b2a6-9cbd8b0e4967',{headers:{authorization:'Bearer '+(tok&&tok.value),'x-app-key':'crm'},failOnStatusCode:false});out['crm '+host]=r.status()+' '+(await r.text()).slice(0,160);}
const lk=await api('GET','/desk/integrations/crm/links?record_id=f925d891-f557-409c-be3f-1043738b6dd8');out.linkAfter=lk.s+' '+lk.t.slice(0,200);
const fq=arr((await api('GET','/desk/integrations/crm/failures?page_size=100')).j).filter(x=>JSON.stringify(x).includes('f925d891')||JSON.stringify(x).includes('8f791451'));out.failuresForOurs=fq.map(x=>x.kind+' '+x.last_error).slice(0,3);
log(`VERIFY ${out.verify.join(', ')}; folderGone=${out.folderGone}; bin left=${out.binLeft}`);
return Object.assign(out,{calls:[...new Set(calls)]});
