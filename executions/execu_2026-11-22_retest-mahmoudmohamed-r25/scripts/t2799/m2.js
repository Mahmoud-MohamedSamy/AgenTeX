const TK='88e8ea44-1658-4df3-9930-d0902b91073d',OW='97be04b6-0a08-4883-aa51-e1650b11cab7';const OUT='../out/2799-made2.json';const M=JSON.parse(fs.readFileSync(OUT,'utf8'));const G='mahmoud.mmohamedsamy@gmail.com';
const E=r=>r.s+(r.s>=300?' '+r.t.slice(0,300):'');M.mails={};
for(const k of ['CPRIV','CPUB']){const t=M.t[k];t.assign=E(await api('POST','/desk/tickets/'+t.id+'/assign',{owner_id:OW}));
 const r=await api('POST','/desk/tickets/'+t.id+'/replies',{mode:'reply',to:[G],subject:'QA RT25B '+k+' customer reply [#'+t.num+']',body_html:'<p>QA RT25B '+k+' (#'+t.num+'): CUSTOMER reply test. Please REPLY to this email from Gmail and keep the subject.</p>'});
 M.mails[k]={res:E(r),at:new Date().toISOString()};await sleep(1500);}
await sleep(12000);
for(const [k,t] of Object.entries(M.t)){const rs=arr((await api('GET','/desk/tickets/'+t.id+'/replies')).j?.data);M.mails[k].status=(rs[0]||{}).status;
 const d=(await api('GET','/modules/'+TK+'/records/'+t.id)).j?.data?.data||[];t.owner=((d.find(x=>x.field==='owner')||{}).value||{}).value===OW;
 t.stateAfterMails=(((await api('GET','/modules/'+TK+'/records/'+t.id+'/blueprint-state')).j?.data?.states||[])[0]||{}).activeStates;}
fs.writeFileSync(OUT,JSON.stringify(M,null,1));
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z 2799 r25b: blueprints QA RT25B BP PRIV/PUB, contact QA RT25B BP customer, tickets #6300 CPRIV, #6301 CPUB (owner ndc-staging-owner); 2 agent mails to Gmail\n');
return JSON.parse(JSON.stringify({mails:M.mails,t:Object.fromEntries(Object.entries(M.t).map(([k,t])=>[k,[t.num,t.assign,t.owner,t.stateAfterMails]]))}));
