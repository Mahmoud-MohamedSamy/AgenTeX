const fs=require('fs');const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20';
const led=m=>fs.appendFileSync(RUN+'/ledger-zoho.md','- '+new Date().toISOString().slice(0,19)+' [ZS] '+m+'\n');
module.exports=async(page,z)=>{const st=JSON.parse(fs.readFileSync(__dirname+'/state.json'));const o={};
const ids=st.t.map(x=>x.id);o.trash=(await z('POST','/api/v1/tickets/moveToTrash',{ticketIds:ids})).s;
const c=await z('GET','/api/v1/contacts/search?lastName='+encodeURIComponent('QA RT20 ZS')+'&limit=20');const cids=(c.j?.data||[]).map(x=>x.id);o.contacts=cids.length+' match state '+cids.includes(st.contact);
if(cids.length)o.ctrash=(await z('POST','/api/v1/contacts/moveToTrash',{contactIds:cids})).s;await page.waitForTimeout(3000);
const b=await z('GET','/api/v1/recycleBin?limit=100');const mine=(b.j?.data||[]).filter(x=>/QA RT20 ZS/.test(JSON.stringify(x)));o.binMine=mine.length;
if(mine.length){const r=await z('POST','/api/v1/recycleBin/delete',{ids:mine.map(x=>x.id)});o.del=r.s;}
const b2=await z('GET','/api/v1/recycleBin?limit=100');o.binAfter=(b2.j?.data||[]).filter(x=>/QA RT20 ZS/.test(JSON.stringify(x))).length;
o.ticketsAfter=[];for(const id of ids)o.ticketsAfter.push((await z('GET','/api/v1/tickets/'+id)).s);
o.searchAfter=(await z('GET','/api/v1/tickets/search?subject='+encodeURIComponent('*QA RT20 ZS*')+'&limit=50')).s;
o.contactAfter=(await z('GET','/api/v1/contacts/search?lastName='+encodeURIComponent('QA RT20 ZS')+'&limit=20')).s;
led('cleanup: tickets #151-#153 moveToTrash '+o.trash+'; contact QA RT20 ZS trashed '+o.ctrash+'; Recycle Bin delete '+o.binMine+' QA RT20 ZS items '+o.del+' -> '+o.binAfter+' left; ticket GET after '+o.ticketsAfter.join('/')+'; contact search '+o.contactAfter+'. Zoho QA RT20 ZS data left: '+(o.binAfter===0?'none':'CHECK'));
return o;};
