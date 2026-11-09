// NDC-2811 retest 8 Nov: RR skips agents whose Email status is off for tickets with no channel (desk #237).
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const CTL=RUN+'/out/presence-ctl.json';const ctl=o=>fs.writeFileSync(CTL,JSON.stringify(o));
const pres=async()=>(await api('POST','/desk/agents/presence/query',{user_ids:[IDS.A1,IDS.A2,IDS.A3]})).j.data.agents.map(a=>nm(a.user_id)+':'+(a.presence.online?'on':'off')+'/email '+a.presence.channels.email);
const waitFor=async(fn,max=90)=>{for(let i=0;i<max/5;i++){const p=await pres();if(fn(p.join(' ')))return p;await sleep(5000);}return await pres();};
const mk=async(sub,extra={})=>{const r=await api('POST','/modules/'+T+'/records',{...body({subject:sub,department:IDS.DA,status:'Open',priority:'Medium',email:'qa.rt14@example.com',...extra}),source:'api'});const id=r.j?.data?.id;if(id)LED('ticket "'+sub+'" '+id+' NDC-2811');
 await sleep(4500);const a=(await act(id))||[];const x=(Array.isArray(a)?a:[]).find(e=>e.action==='ticket.auto_assigned');const tk=await getT(id);
 return {t:sub.replace('QA AS6 SEQ RT14 2811 ',''),no:tk.ticket_number,ch:extra.channel||'none',owner:nm((await own(id)).owner),skipped:x?(x.summary.skipped_user_ids||[]).map(nm):'no RR entry',reasons:x?JSON.stringify(x.summary.skipped||x.summary.skip_reasons||'').slice(0,160):'',id};};
const o={};const seq0=(await getRule(IDS.RR_SEQ)).execute_on;const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
try{
 o.exec=(await putRule(IDS.RR_SEQ,{execute_on:['create','update']})).s;LED('NDC-2811: RR_SEQ execute_on create+update temporarily');
 ctl({a1:'on',a2:'on',a3:'on'});o.p0=await waitFor(s=>(s.match(/:on\/email true/g)||[]).length===3);
 o.allOn=[];for(let i=1;i<=3;i++)o.allOn.push(await mk('QA AS6 SEQ RT14 2811 allon '+i));
 ctl({a1:'on',a2:'emailoff',a3:'on'});o.p1=await waitFor(s=>/A2:on\/email false/.test(s));
 o.a2EmailOff=[];for(let i=1;i<=4;i++)o.a2EmailOff.push(await mk('QA AS6 SEQ RT14 2811 a2off '+i));
 o.a2EmailOff.push(await mk('QA AS6 SEQ RT14 2811 a2off email ch',{channel:'email'}));
 o.a2EmailOff.push(await mk('QA AS6 SEQ RT14 2811 a2off chat ch',{channel:'chat'}));
 ctl({a1:'emailoff',a2:'emailoff',a3:'emailoff'});o.p2=await waitFor(s=>(s.match(/:on\/email false/g)||[]).length===3);
 o.allEmailOff=[await mk('QA AS6 SEQ RT14 2811 alloff 1')];
 o.offlineOn=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true})).s;LED('NDC-2811: Dept A assign_to_offline_agents ON temporarily');
 o.allEmailOffOfflineAllowed=[await mk('QA AS6 SEQ RT14 2811 alloff offline allowed')];
}finally{
 o.prefsBack=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0)).s;LED('NDC-2811: Dept A RR prefs restored');
 ctl({a1:'on',a2:'on',a3:'on'});o.p3=await waitFor(s=>(s.match(/:on\/email true/g)||[]).length===3);
 o.backOn=[await mk('QA AS6 SEQ RT14 2811 back on 1')];
 o.execBack=(await putRule(IDS.RR_SEQ,{execute_on:seq0})).s;LED('NDC-2811: RR_SEQ execute_on restored ('+seq0+'); presence back to on');
}
fs.writeFileSync(RUN+'/out/t2811.json',JSON.stringify(o,null,1));return o;
