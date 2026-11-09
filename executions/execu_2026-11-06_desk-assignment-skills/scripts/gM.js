// 7 Nov B-2 recheck: Email channel off but online (chat/phone on, heartbeat) -> should be skipped by RR
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const CTL='../out/presence-ctl.json';const ctl=o=>fs.writeFileSync(CTL,JSON.stringify(o));
const pres=async()=>(await api('POST','/desk/agents/presence/query',{user_ids:[IDS.A1,IDS.A2,IDS.A3]})).j.data.agents.map(a=>nm(a.user_id)+':'+(a.presence.online?'on':'off')+'/email '+a.presence.channels.email);
const waitFor=async(fn,max=90)=>{for(let i=0;i<max/5;i++){const p=await pres();if(fn(p.join(' ')))return p;await sleep(5000);}return await pres();};
const seq0=(await getRule(IDS.RR_SEQ)).execute_on;await putRule(IDS.RR_SEQ,{execute_on:['create','update']});
const mk=async(sub)=>{const t=await mkTicket(sub,IDS.DA,{},'B-2 recheck');await sleep(4000);const a=(await act(t.id))||[];const x=(Array.isArray(a)?a:[]).find(e=>e.action==='ticket.auto_assigned');return {n:sub.slice(-6),owner:nm((await own(t.id)).owner),skipped:x?(x.summary.skipped_user_ids||[]).map(nm):'no RR entry',id:t.id};};
const o={};
o.p0=await waitFor(s=>/A1:on\/email true.*|/.test(s)&&(s.match(/:on\/email true/g)||[]).length===3);
o.allOn=[];for(let i=1;i<=3;i++)o.allOn.push(await mk('QA AS6 SEQ b2r allon '+i));
ctl({a1:'on',a2:'emailoff',a3:'on'});o.p1=await waitFor(s=>/A2:on\/email false/.test(s));
o.a2EmailOff=[];for(let i=1;i<=3;i++)o.a2EmailOff.push(await mk('QA AS6 SEQ b2r a2off '+i));
ctl({a1:'emailoff',a2:'emailoff',a3:'emailoff'});o.p2=await waitFor(s=>(s.match(/:on\/email false/g)||[]).length===3);
o.allEmailOff=[await mk('QA AS6 SEQ b2r alloff 1')];
ctl({a1:'on',a2:'on',a3:'on'});
o.back=(await putRule(IDS.RR_SEQ,{execute_on:seq0})).s;LED('B-2 recheck: RR_SEQ create temporarily, restored; presence via keeper back to on');
return o;
