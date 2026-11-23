const TK='88e8ea44-1658-4df3-9930-d0902b91073d',CONTACTS='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const OUT='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-21_retest-mahmoudmohamed-r24/out/2799-made.json';
const B='mahmoud.mmohamedsamy@gmail.com';const M=JSON.parse(fs.readFileSync(OUT,'utf8'));const v=x=>({kind:'string',value:String(x)});const E=r=>r.s+(r.s>=300?' '+r.t.slice(0,300):'');
M.contactUpd=E(await api('PATCH','/modules/'+CONTACTS+'/records/'+M.contact,{data:[{field:'email',value:v(B)}]}));
M.mails={};
for(const k of ['PRIV1','PUB1','ALL2']){const t=M.tickets[k];
 M.tickets[k].emailUpd=E(await api('PATCH','/modules/'+TK+'/records/'+t.id,{data:[{field:'email',value:v(B)}]}));
 const r=await api('POST','/desk/tickets/'+t.id+'/replies',{mode:'reply',to:[B],subject:'QA RT24 '+k+' customer reply test',body_html:'<p>QA RT24 '+k+' (#'+t.num+'): please REPLY to this email from Gmail (customer reply).</p>'});
 M.mails[k+'-customer']={res:E(r),at:new Date().toISOString(),id:r.j?.data?.id,vis:r.j?.data?.visibility,status:r.j?.data?.status};await sleep(1500);}
await sleep(4000);
for(const k of ['PRIV1','PUB1','ALL2']){const t=M.tickets[k];const s=(((await api('GET','/modules/'+TK+'/records/'+t.id+'/blueprint-state')).j?.data?.states||[])[0]||{}).activeStates;M.tickets[k].stateAfterAgentReply=s;}
fs.writeFileSync(OUT,JSON.stringify(M,null,1));log(JSON.stringify({c:M.contactUpd,mails:M.mails,st:Object.fromEntries(Object.entries(M.tickets).map(([k,t])=>[k,t.stateAfterAgentReply]))}).replace(/mahmoud\.mmohamedsamy/g,'G'));
