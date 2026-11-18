const fs=require('fs');const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20';
const led=m=>fs.appendFileSync(RUN+'/ledger-zoho.md','- '+new Date().toISOString().slice(0,19)+' [ZS] '+m+'\n');
const M=s=>String(s).replace(/[\w.+-]+@[\w.-]+/g,'<email>');
module.exports=async(page,z)=>{const D='1499272000000006907';const st=JSON.parse(fs.readFileSync(__dirname+'/state.json'));const o={};
const fa=await z('GET','/api/v1/mailReplyAddress?departmentId='+D);const from=(fa.j?.data||[])[0]?.address;
const idx=(process.env.IDX||'0,1,2').split(',').map(Number);
for(const i of idx){const t=st.t[i];const tk=await z('GET','/api/v1/tickets/'+t.id);const ct=await z('GET','/api/v1/contacts/'+tk.j?.contactId);const to=tk.j?.email||ct.j?.email;
if(!/@example\.com$/.test(to||'')){o[t.n]='SKIP: contact not example.com';continue;}
const r=await z('POST','/api/v1/tickets/'+t.id+'/sendReply',{channel:'EMAIL',fromEmailAddress:from,to,content:'QA RT20 ZS agent reply '+(process.env.TAG||'1'),contentType:'plainText'});
led('sendReply on #'+t.n+' to contact example.com address -> '+r.s+' thread '+r.j?.id);
const th=r.j?.id;await page.waitForTimeout(4000);const g=await z('GET','/api/v1/tickets/'+t.id+'/threads/'+th);
const oc=await z('GET','/api/v1/tickets/'+t.id+'/threads/'+th+'/originalContent');
const subjHdr=(oc.t.match(/Subject:[^\n]*/)||[''])[0];
const all=await z('GET','/api/v1/tickets/'+t.id+'/threads?limit=20');
o[t.n]={ticketSubject:tk.j?.subject,send:r.s+' '+(r.s>=300?M(r.t):''),threadKeys:g.j?Object.keys(g.j).join(','):M(g.t),threadSubject:g.j?.subject,summary:(g.j?.summary||'').slice(0,80),oc:oc.s+' '+M(subjHdr),ocRaw:oc.s<300?'':M(oc.t).slice(0,200),
threads:(all.j?.data||[]).map(x=>x.direction+' '+x.channel+' subj='+(x.subject||'')+' sum='+(x.summary||'').slice(0,40))};}
return o;};
