// NDC-2275 retest, part 2: final owners of the fast-read cases, SKIPPED text, timing, audit of the master switch, workflow order cases.
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={};const save=()=>fs.writeFileSync(OUT+'/t2.json',JSON.stringify(R,null,1));
const cs=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERR:String(e.message).slice(0,300)};if(/STOP 429|SIGNED_OUT/.test(e.message))throw e;}save();};
const led=fs.readFileSync(OUT+'/../ledger.md','utf8').split('\n');const tid=sub=>led.filter(l=>l.includes('ticket "')&&l.includes(sub)).map(l=>l.trim().split(' ').pop());
const {RULES}=JSON.parse(fs.readFileSync(OUT+'/t1-rules.json','utf8'));
const notifFor=async(who,no)=>{const r=await as(who,'GET','/notifications?limit=100');const d=r.j&&r.j.data;const L=Array.isArray(d)?d:(d&&d.data)||[];return L.filter(n=>String(n.title||'').includes('#'+no+' ')).map(n=>n.event_type+': '+String(n.title).slice(0,50));};
const nsUrl='/desk/assignment/notification-settings';const ns0=(await api('GET',nsUrl)).j.data;const WF=[];
const pollOwner=async(id,max=15000)=>{const t0=Date.now();for(;;){const o=await own(id);if(o.owner!=='-')return{owner:o.owner,no:o.no,ms:Date.now()-t0};if(Date.now()-t0>max)return{owner:'-',no:o.no,ms:Date.now()-t0};await W(200);}};
try{
 await pres({a2:'on',a3:'on'});await W(3000);
 await cs('A final owners',async()=>{const o={};for(const s of ['RT15MOVE','RT15LOAD','RT15SEQ speed']){o[s]=[];for(const id of tid(s))o[s].push((await own(id)).owner);}return o;});
 await cs('B move history full',async()=>{const id=tid('RT15MOVE')[0];const a=await act(id);return{own:await own(id),a:a.map(x=>x.action+' '+JSON.stringify(x.summary||{}).slice(0,700)).filter(x=>/auto_assigned|department/.test(x))};});
 await cs('C SKIPPED text',async()=>{const ids=tid('RT15TRI off');const o=[];for(const id of ids){const a=(await act(id)).filter(x=>x.action==='ticket.auto_assigned');o.push(a.map(x=>({owner:nm(x.summary.owner_id),rule:x.summary.rule_name,strategy:x.summary.strategy,skipped:x.summary.skipped_user_ids||x.summary.skipped||x.summary.skipped_agents,keys:Object.keys(x.summary).join(',')})));}return o;});
 await cs('D timing RR: create -> owner visible (poll 200 ms)',async()=>{const m=[];for(let i=0;i<8;i++){const t=await mk(PX+' RT15SEQ timing '+i,null,{owner:null});const p=await pollOwner(t.id);m.push({owner:p.owner,createMs:t.ms,afterCreateMs:p.ms});await W(1000);}return m;});
 await cs('E load based, wait for each',async()=>{const wl=async u=>{const d=(await api('GET','/desk/agents/'+u+'/workload')).j.data;return (d.departments||[]).reduce((n,x)=>n+x.open_tickets,0);};const before={A2:await wl(IDS.A2),A3:await wl(IDS.A3)};const s=[];for(let i=0;i<4;i++){const t=await mk(PX+' RT15LOAD w'+i,null,{owner:null});const p=await pollOwner(t.id);s.push(p.owner);await W(1000);}return{before,seq:s,after:{A2:await wl(IDS.A2),A3:await wl(IDS.A3)}};});
 // master switch audit (GEN-11)
 const t0=new Date().toISOString();
 const on=await api('PUT',nsUrl,{...ns0,direct_rules_enabled:true});LED('direct master ON temporarily (found OFF)');R.masterOn=sh(on);await W(1500);
 const mkWf=async(name,crit,actions)=>{const r=await api('POST','/workflow/rules',{moduleId:T,layoutId:'',name:PX+' '+name,description:'QA retest NDC-2275, safe to delete',mode:'Recurring',isActive:true,trigger:{kind:'RecordCreated'},criteria:crit,actions});const id=r.j&&r.j.data&&r.j.data.id;if(id){LED('workflow "'+name+'" '+id);WF.push(id);}else throw new Error('wf '+r.s+' '+E(r));return id;};
 const SM2=v=>({kind:'StringMatch',field:'subject',operator:'StartsWith',stringValue:v,caseInsensitive:false});
 const OW=u=>({type:'OwnerAssignment',order:0,delaySeconds:0,ownerTargetKind:'SpecificUser',ownerValue:u});
 await cs('F timing direct',async()=>{const m=[];for(let i=0;i<3;i++){const t=await mk(PX+' RT15DIR timing '+i,null,{owner:null});const o=(await own(t.id)).owner;m.push({firstRead:o,createMs:t.ms});}return m;});
 await cs('G EO-2 workflow "owner is A1" fires after direct rule (action sets A3)',async()=>{RULES.E2=await mkRule(DR('eo2','RT15EO2',IDS.DA,null,AG(IDS.A1)));await mkWf('eo2',{kind:'Logical',operator:'And',operands:[SM2(PX+' RT15EO2'),{kind:'Comparison',field:'owner',operator:'Equal',value:{kind:'string',stringValue:IDS.A1}}]},[OW(IDS.A3)]);const t=await mk(PX+' RT15EO2',null,{owner:null});await W(4000);const o=await own(t.id);return{...o,auto:(await act(t.id)).filter(x=>/auto_assigned|owner_changed/.test(x.action)).map(x=>x.action+' '+nm(x.summary.owner_id||x.summary.new_value))};});
 await cs('H EO-3 workflow owner, RR leaves it',async()=>{await mkWf('eo3',SM2(PX+' RT15EO3'),[OW(IDS.A3)]);RULES.E3=await mkRule(RR('eo3','RT15EO3','sequential',[IDS.A2]));const t=await mk(PX+' RT15EO3',null,{owner:null});await W(4000);return{...(await own(t.id)),autoRR:(await act(t.id)).filter(x=>x.action==='ticket.auto_assigned').length};});
 await cs('I EO-4/5 direct A2 then workflow A3: only A3 notified',async()=>{RULES.E5=await mkRule(DR('eo5','RT15EO5',IDS.DA,null,AG(IDS.A2)));await mkWf('eo5',SM2(PX+' RT15EO5'),[OW(IDS.A3)]);const t=await mk(PX+' RT15EO5',null,{owner:null});await W(5000);const o=await own(t.id);return{...o,hist:(await act(t.id)).filter(x=>/auto_assigned|owner_changed/.test(x.action)).map(x=>x.action+' '+nm(x.summary.owner_id||x.summary.new_value)).reverse(),notifA2:await notifFor('a2',o.no),notifA3:await notifFor('a3',o.no)};});
 await cs('J RR notification: one assigned, and history one entry',async()=>{const t=await mk(PX+' RT15SEQ notif',null,{owner:null});const p=await pollOwner(t.id);await W(3000);const o={no:p.no,owner:p.owner};o.a2=await notifFor('a2',p.no);o.a3=await notifFor('a3',p.no);o.autoEntries=(await act(t.id)).filter(x=>x.action==='ticket.auto_assigned').length;return o;});
 await cs('K reopen a closed ticket, rule on update',async()=>'skipped: Reopened status path covered by update trigger');
 const off=await api('PUT',nsUrl,ns0);LED('direct master restored to found value '+ns0.direct_rules_enabled+' '+off.s);R.masterBack=(await api('GET',nsUrl)).j.data;await W(4000);
 await cs('L audit shows the master switch change?',async()=>{const r=await api('GET','/audit/events?limit=100');const L=arr(r.j.data).filter(x=>String(x.occurred_at)>=t0);const m=L.filter(x=>/assignment|direct_rules|notification|desk_settings|settings/i.test((x.target_type||'')+JSON.stringify(x.changes||[])));return{since:t0,total:L.length,types:[...new Set(L.map(x=>x.target_type))],matching:m.filter(x=>/direct_rules|DirectRules/i.test(JSON.stringify(x))).map(x=>({t:x.occurred_at,tg:x.target_type,c:JSON.stringify(x.changes).slice(0,240)}))};});
}finally{
 const b=await api('PUT',nsUrl,ns0);R.masterFinal=b.s;
 for(const id of WF){const r=await api('GET','/workflow/rules/'+id);const v=r.j&&r.j.data;if(v){const u=await api('PUT','/workflow/rules/'+id,{...v,isActive:false});R['wfOff '+id.slice(0,4)]=u.s;LED('workflow deactivated '+id+' '+u.s);}}
 fs.writeFileSync(OUT+'/t2-rules.json',JSON.stringify({RULES,WF},null,1));save();
}
return 'ok';
