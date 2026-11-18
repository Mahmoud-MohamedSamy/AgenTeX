const fs=require('fs'); const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19';
const LZ=m=>fs.appendFileSync(RUN+'/ledger-zoho.md','| '+new Date().toISOString().slice(11,16)+' | GS lane (Zoho CRM org946877290): '+m+' |\n');
const Z=JSON.parse(fs.readFileSync(RUN+'/out/gs/zoho-ids.json','utf8'));
for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads',{waitUntil:'commit',timeout:120000}); break;}catch(e){} } await sleep(20000);
const d=await zapi('DELETE','/crm/v8/settings/global_picklists/'+Z.gid); const one=await zapi('GET','/crm/v8/settings/global_picklists/'+Z.gid);
LZ('set delete retry → '+d.s+' '+d.t.slice(0,160).replace(/\|/g,'/')+'; GET set → '+one.s);
return {del:d.s+' '+d.t.slice(0,300), get:one.s+' '+one.t.slice(0,300)};
