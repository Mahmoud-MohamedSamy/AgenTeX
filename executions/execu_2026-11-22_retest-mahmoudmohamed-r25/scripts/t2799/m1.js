const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-22_retest-mahmoudmohamed-r25';
const OUT=RUN+'/out/2799-made.json';const M=JSON.parse(fs.readFileSync(OUT,'utf8'));const G='mahmoud.mmohamedsamy@gmail.com';
const E=r=>r.s+(r.s>=300?' '+r.t.slice(0,300):'');M.mails={};
for(const k of ['CPRIV','CPUB','CALL']){const t=M.t[k];
 const r=await api('POST','/desk/tickets/'+t.id+'/replies',{mode:'reply',to:[G],subject:'QA RT25 '+k+' customer reply [#'+t.num+']',body_html:'<p>QA RT25 '+k+' (#'+t.num+'): CUSTOMER reply test. Please REPLY to this email from Gmail and keep the subject.</p>'});
 M.mails[k]={res:E(r),at:new Date().toISOString(),id:r.j?.data?.id,pub:r.j?.data?.is_public,subject:r.j?.data?.subject};await sleep(1500);}
for(const k of ['FPRIV','FPUB','FALL','FDEF']){const t=M.t[k];
 const r=await api('POST','/desk/tickets/'+t.id+'/replies',{mode:'forward',to:[G],subject:'Fwd: QA RT25 '+k+' private thread [#'+t.num+']',body_html:'<p>QA RT25 '+k+' (#'+t.num+'): PRIVATE thread test (third party). Please REPLY to this email from Gmail and keep the subject.</p>'});
 M.mails[k]={res:E(r),at:new Date().toISOString(),id:r.j?.data?.id,pub:r.j?.data?.is_public,subject:r.j?.data?.subject};await sleep(1500);}
await sleep(15000);
for(const [k,t] of Object.entries(M.t)){const rs=arr((await api('GET','/desk/tickets/'+t.id+'/replies')).j?.data);const x=rs.find(y=>y.id===M.mails[k].id)||rs[0]||{};
 M.mails[k].status=x.status;M.mails[k].keys=Object.keys(x).filter(z=>/message|provider|ses|header/i.test(z));M.mails[k].msgid=Object.fromEntries(M.mails[k].keys.map(z=>[z,String(x[z]).slice(0,90)]));
 t.stateAfterMails=(((await api('GET','/modules/'+TK+'/records/'+t.id+'/blueprint-state')).j?.data?.states||[])[0]||{}).activeStates;}
fs.writeFileSync(OUT,JSON.stringify(M,null,1));
return JSON.parse(JSON.stringify({mails:M.mails,st:Object.fromEntries(Object.entries(M.t).map(([k,t])=>[k,t.stateAfterMails]))}).replace(/mahmoud\.mmohamedsamy/g,'G'));
