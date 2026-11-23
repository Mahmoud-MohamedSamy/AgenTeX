const OUT='out/2799-made.json';const M=JSON.parse(fs.readFileSync(OUT,'utf8'));
const B='mahmoud.mmohamedsamy@gmail.com', X='nafoye7184@afronewz.com';const E=r=>r.s+(r.s>=300?' '+r.t.slice(0,300):'');
M.mails2={};
for(const k of ['PRIV1','PUB1','ALL2']){const t=M.tickets[k];
 const r=await api('POST','/desk/tickets/'+t.id+'/replies',{mode:'reply',to:[B],subject:'QA RT24 '+k+' customer reply [#'+t.num+']',body_html:'<p>QA RT24 '+k+' (#'+t.num+'): second try. Please REPLY to this email from Gmail (customer reply). Keep the subject as it is.</p>'});
 M.mails2[k+'-customer']={res:E(r),at:new Date().toISOString(),subject:r.j?.data?.subject};await sleep(1500);}
for(const k of ['PRIV1','PUB1','ALL1','DEF1']){const t=M.tickets[k];
 const r=await api('POST','/desk/tickets/'+t.id+'/replies',{mode:'forward',to:[X],subject:'Fwd: QA RT24 '+k+' private thread [#'+t.num+']',body_html:'<p>QA RT24 '+k+' (#'+t.num+'): private thread test. Please REPLY to this email from this mailbox. Keep the subject as it is.</p>'});
 M.mails2[k+'-private']={res:E(r),at:new Date().toISOString(),subject:r.j?.data?.subject,vis:r.j?.data?.is_public};await sleep(1500);}
await sleep(5000);
for(const [k,t] of Object.entries(M.tickets)){const rs=arr((await api('GET','/desk/tickets/'+t.id+'/replies')).j?.data);M.mails2[k+'-status']=rs.map(x=>[x.mode,x.status,x.is_public]).slice(0,3);
 M.tickets[k].stateAfterMails2=(((await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+t.id+'/blueprint-state')).j?.data?.states||[])[0]||{}).activeStates;}
M.wrongTickets=['5981','5982','5983'];
fs.writeFileSync(OUT,JSON.stringify(M,null,1));
return {mails:M.mails2,states:Object.fromEntries(Object.entries(M.tickets).map(([k,t])=>[k,t.stateAfterMails2]))};
