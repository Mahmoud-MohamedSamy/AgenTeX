eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const DA=IDS.DA;const NM={[IDS.A1]:'A1',[IDS.A2]:'A2',[IDS.A3]:'A3',[IDS.O]:'owner(creator)'};const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const s0=(await getRule(IDS.RR_SEQ)).execute_on,k0=(await getRule(IDS.RR_SKILL)).execute_on;const pr0=(await api('GET','/desk/departments/'+DA+'/round-robin-preferences')).j.data;
const rep=async id=>{const a=await act(id);const L=Array.isArray(a)?a:[];const c=L.find(e=>e.action==='ticket.created');const g=await getT(id);return{num:g.ticket_number,owner:nm((await own(id)).owner),skills:g.skills,createdOwner:nm(c&&c.summary&&c.summary.initial&&c.summary.initial.owner_id),auto:L.filter(e=>e.action==='ticket.auto_assigned').map(e=>(e.summary.rule_type||e.summary.kind)+'/'+e.summary.trigger+'/'+nm(e.summary.owner_id))};};
try{
 await putRule(IDS.RR_SEQ,{execute_on:['create','update']});await putRule(IDS.RR_SKILL,{execute_on:['create','update']});await api('PUT','/desk/departments/'+DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true});LED('NDC-2821 control: RR_SEQ, RR_SKILL create + offline ON temporarily');
 const t1=await mkTicket('QA AS6 SEQ rt14 control no owner',DA,{},'NDC-2821 control');const t2=await mkTicket('QA AS6 SEQ rt14 control null owner',DA,{owner:null},'NDC-2821 control');const t3=await mkTicket('QA AS6 SKR QA AS6 SK2 rt14 b',DA,{},'NDC-2821 control');const t4=await mkTicket('QA AS6 SKR QA AS6 SK2 rt14 c',DA,{owner:null},'NDC-2821 control');
 await sleep(9000);o.seqNoOwner=await rep(t1.id);o.seqNull=await rep(t2.id);o.skrNoOwner=await rep(t3.id);o.skrNull=await rep(t4.id);
}finally{o.back=[(await putRule(IDS.RR_SEQ,{execute_on:s0})).s,(await putRule(IDS.RR_SKILL,{execute_on:k0})).s,(await api('PUT','/desk/departments/'+DA+'/round-robin-preferences',pr0)).s];LED('NDC-2821 control: restored');}
return o;
