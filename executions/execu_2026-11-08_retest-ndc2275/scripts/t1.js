// NDC-2275 retest, part 1: the fix, sequential, offline/SKIPPED, execution order, master switch, direct rule behaviours.
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={};const save=()=>fs.writeFileSync(OUT+'/t1.json',JSON.stringify(R,null,1));
const cs=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERR:String(e.message).slice(0,300)};if(/STOP 429|SIGNED_OUT/.test(e.message))throw e;}save();};
const mkS=async(subject,extra={},dept)=>{const t0=Date.now();const r=await api('POST','/modules/'+T+'/records',{...body({subject,department:dept||IDS.DA,status:'Open',priority:'Medium',email:'qa.rt15@example.com',...extra}),source:'api'});const d=r.j&&r.j.data;const id=d&&(d.id||(d.record&&d.record.id));if(id)LED('ticket "'+subject+'" '+id);return{s:r.s,id,e:E(r),ms:Date.now()-t0};};
const res=async(t,w=1500)=>{await W(w);const a=await own(t.id);return{no:a.no,owner:a.owner,team:a.team,ms:t.ms,s:t.s,e:t.e};};
const seqOf=async L=>{const o=[];for(const t of L){o.push((await own(t.id)).owner);}return o;};
const notifFor=async(who,no)=>{const r=await as(who,'GET','/notifications?limit=100');const d=r.j&&r.j.data;const L=Array.isArray(d)?d:(d&&d.data)||[];return L.filter(n=>String(n.title||'').includes('#'+no+' ')).map(n=>n.event_type+': '+String(n.title).slice(0,50));};
const RULES={},WF=[];
const nsUrl='/desk/assignment/notification-settings';
const ns0=(await api('GET',nsUrl)).j.data;const p0=await getP();R.found={switches:ns0,prefs:p0};save();
try{
 await pres({a2:'on',a3:'on'});
 // ---- 1. The fix
 RULES.SEQ=await mkRule(RR('seq','RT15SEQ','sequential',[IDS.A2,IDS.A3]));
 await cs('1a owner null',async()=>res(await mk(PX+' RT15SEQ owner null',null,{owner:null})));
 await cs('1b no owner, source api',async()=>res(await mkS(PX+' RT15SEQ source api')));
 await cs('1c no owner, source field web_form',async()=>res(await mk(PX+' RT15SEQ source web_form',null,{source:'web_form'})));
 await cs('1d no owner, no source',async()=>res(await mk(PX+' RT15SEQ plain')));
 await cs('1e owner A1 preset',async()=>{const t=await mk(PX+' RT15SEQ preset',null,{owner:IDS.A1});const r=await res(t);r.hist=await hist(t.id);return r;});
 await cs('1f history of RR on create',async()=>{const t=await mk(PX+' RT15SEQ hist',null,{owner:null});await W(1500);const a=await act(t.id);return{own:await own(t.id),h:await hist(t.id),raw:a.slice(0,4).map(x=>({a:x.action,s:JSON.stringify(x.summary).slice(0,500)}))};});
 await cs('1g all offline: waits unassigned, not the creator',async()=>{await pres({a2:'out',a3:'out'});const t=await mk(PX+' RT15SEQ all out',null,{owner:null});const r=await res(t);r.hist=await hist(t.id);await pres({a2:'on',a3:'on'});return r;});
 // ---- 2. Sequential rotation
 await cs('2a 3 agents, offline allowed: 6 tickets',async()=>{RULES.SEQ3=await mkRule(RR('seq3','RT15TRI','sequential',[IDS.A1,IDS.A2,IDS.A3]));await setP(p0,{assign_to_offline_agents:true});LED('Dept A offline allowed ON temporarily');const L=[];for(let i=1;i<=6;i++)L.push(await mk(PX+' RT15TRI '+i,null,{owner:null}));await W(1500);const s=await seqOf(L);await setP(p0,{});LED('Dept A prefs restored');return s;});
 await cs('2b A1 offline: SKIPPED',async()=>{const L=[];for(let i=1;i<=4;i++)L.push(await mk(PX+' RT15TRI off '+i,null,{owner:null}));await W(1500);const s=await seqOf(L);const h=[];for(const t of L)h.push((await hist(t.id)).filter(x=>/SKIP|skipp/i.test(x)).length);return{seq:s,entriesNamingSkipped:h,sample:(await hist(L[0].id))[0]};});
 // ---- 3. Master switch (found OFF, all other direct rules inactive)
 RULES.DM=await mkRule(DR('master','RT15MASTER',IDS.DA,null,AG(IDS.A2)));
 await cs('3a direct master OFF as found: rule does not act',async()=>{const t=await mk(PX+' RT15MASTER off',null,{owner:null});const r=await res(t);r.master=(await api('GET',nsUrl)).j.data.direct_rules_enabled;return r;});
 const cnt=async()=>{const L=await api('GET','/desk/assignment-rules?type=direct');return{listed:L.j.data.rules.filter(x=>x.name.includes(PX)).length,active:L.j.data.rules.filter(x=>x.is_active).map(x=>x.name)};};
 R.activeBeforeOn=await cnt();
 const on=await api('PUT',nsUrl,{...ns0,direct_rules_enabled:true});LED('direct master ON temporarily (found OFF)');R.masterOn=sh(on);
 await W(1000);
 await cs('3b master ON: rule acts',async()=>res(await mk(PX+' RT15MASTER on',null,{owner:null})));
 // ---- 4. Direct rule behaviours + order
 RULES.D1=await mkRule(DR('dir','RT15DIR',IDS.DA,null,AG(IDS.A1)));
 RULES.RRD=await mkRule(RR('rr vs dir','RT15DIR','sequential',[IDS.A2,IDS.A3]));
 await cs('4a direct + RR both match: direct wins, A1 offline still gets it',async()=>{const t=await mk(PX+' RT15DIR urgent',null,{owner:null});const r=await res(t);r.hist=await hist(t.id);return r;});
 await cs('4b direct: preset owner kept',async()=>res(await mk(PX+' RT15DIR preset',null,{owner:IDS.A3})));
 await cs('4c direct: form-default style, no owner + no source, rule still decides',async()=>res(await mk(PX+' RT15DIR plain')));
 RULES.DT=await mkRule(DR('team','RT15TEAM',IDS.DA,null,TM(IDS.TA)));
 await cs('4d team target: team, no owner, members notified once, outsider none',async()=>{const t=await mk(PX+' RT15TEAM',null,{owner:null});const r=await res(t,3000);r.a2=await notifFor('a2',r.no);r.a3=await notifFor('a3',r.no);r.raw=(await getT(t.id));r.raw={owner:r.raw.owner,team:r.raw.team};return r;});
 RULES.DMV=await mkRule(DR('move','RT15MOVE',null,IDS.DA,UN));
 RULES.RRMV=await mkRule(RR('after move','RT15MOVE','sequential',[IDS.A2,IDS.A3]));
 await cs('4e direct moves to Dept A unassigned: Dept A RR assigns in same event',async()=>{const t=await mk(PX+' RT15MOVE',IDS.DB,{owner:null});const r=await res(t);r.hist=await hist(t.id);return r;});
 RULES.DUP=await mkRule(DR('on update','RT15UPD',IDS.DA,null,AG(IDS.A2),{execute_on:['update']}));
 await cs('4f rule on update: unowned assigned; owned kept',async()=>{const t=await mk(PX+' RT15UPD a',null,{owner:null});const b4=(await own(t.id)).owner;const p=await api('PATCH','/modules/'+T+'/records/'+t.id,body({priority:'High'}));await W(1500);const t2=await mk(PX+' RT15UPD b',null,{owner:IDS.A3});await api('PATCH','/modules/'+T+'/records/'+t2.id,body({priority:'High'}));await W(1500);return{beforeUpdate:b4,patch:p.s,after:(await own(t.id)).owner,owned:(await own(t2.id)).owner};});
 RULES.ST=await mkRule(DR('stop','RT15UNA',IDS.DA,null,UN));RULES.ST2=await mkRule(DR('never','RT15UNA',IDS.DA,null,AG(IDS.A1)));
 await cs('4g Mark as Unassigned stops next direct rule',async()=>res(await mk(PX+' RT15UNA',null,{owner:null})));
 // ---- 5. Workflows in the same event
 const mkWf=async(name,crit,actions)=>{const r=await api('POST','/workflow/rules',{moduleId:T,layoutId:'',name:PX+' '+name,description:'QA retest NDC-2275, safe to delete',mode:'Recurring',isActive:true,trigger:{kind:'RecordCreated'},criteria:crit,actions});const id=r.j&&r.j.data&&r.j.data.id;if(id){LED('workflow "'+name+'" '+id);WF.push(id);}else throw new Error('wf '+r.s+' '+E(r));return id;};
 const SM=v=>({kind:'StringMatch',field:'subject',operator:'Contains',stringValue:v,caseInsensitive:false});
 const SM2=v=>({kind:'StringMatch',field:'subject',operator:'StartsWith',stringValue:v,caseInsensitive:false});
 await cs('5a EO-2 workflow "owner is A1" fires on direct rule result',async()=>{RULES.E2=await mkRule(DR('eo2','RT15EO2',IDS.DA,null,AG(IDS.A1)));await mkWf('eo2',{kind:'Logical',operator:'And',operands:[SM2(PX+' RT15EO2'),{kind:'Comparison',field:'owner',operator:'Equal',value:{kind:'string',stringValue:IDS.A1}}]},[{type:'AddTags',order:0,delaySeconds:0,tags:['qa-rt15-eo2']}]);const t=await mk(PX+' RT15EO2',null,{owner:null});await W(3000);const o=await getT(t.id);return{owner:nm(o.owner),tags:o.tags||o.tag};});
 await cs('5b EO-3 workflow owner on create, RR leaves it',async()=>{await mkWf('eo3',SM2(PX+' RT15EO3'),[{type:'OwnerAssignment',order:0,delaySeconds:0,ownerTargetKind:'User',ownerValue:IDS.A3}]);RULES.E3=await mkRule(RR('eo3','RT15EO3','sequential',[IDS.A1,IDS.A2]));const t=await mk(PX+' RT15EO3',null,{owner:null});const r=await res(t,3000);r.hist=await hist(t.id);return r;});
 await cs('5c EO-4/5 direct A2 then workflow A3: only A3 notified',async()=>{RULES.E5=await mkRule(DR('eo5','RT15EO5',IDS.DA,null,AG(IDS.A2)));await mkWf('eo5',SM2(PX+' RT15EO5'),[{type:'OwnerAssignment',order:0,delaySeconds:0,ownerTargetKind:'User',ownerValue:IDS.A3}]);const t=await mk(PX+' RT15EO5',null,{owner:null});const r=await res(t,4000);r.hist=await hist(t.id);r.notifA2=await notifFor('a2',r.no);r.notifA3=await notifFor('a3',r.no);return r;});
 await cs('5d no matching rule: unassigned stays',async()=>res(await mk(PX+' RT15NOMATCH',null,{owner:null})));
 // ---- 6. RR variants on create
 await cs('6a two RR rules match: first in list acts',async()=>{RULES.TW1=await mkRule(RR('two1','RT15TWO','sequential',[IDS.A2]));RULES.TW2=await mkRule(RR('two2','RT15TWO','sequential',[IDS.A3]));const s=[];for(let i=0;i<2;i++)s.push(await res(await mk(PX+' RT15TWO '+i,null,{owner:null})));return s.map(x=>x.owner);});
 await cs('6b skill added on create, skill RR in same event',async()=>{RULES.SK=await mkRule(RR('skill','RT15SKL','skill',[IDS.A1,IDS.A2,IDS.A3]));const t=await mk(PX+' RT15SKL QA AS6 SK2',null,{owner:null});const r=await res(t,2500);const o=await getT(t.id);r.skills=o.skills;r.hist=await hist(t.id);return r;});
 await cs('6c load based: fewest open first',async()=>{const wl=async u=>{const d=(await api('GET','/desk/agents/'+u+'/workload')).j.data;return (d.departments||[]).reduce((n,x)=>n+x.open_tickets,0);};const a=await wl(IDS.A2),b=await wl(IDS.A3);RULES.LD=await mkRule(RR('load','RT15LOAD','load',[IDS.A2,IDS.A3]));const s=[];for(let i=0;i<4;i++){s.push((await res(await mk(PX+' RT15LOAD '+i,null,{owner:null}),800)).owner);}return{open:{A2:a,A3:b},seq:s};});
 // NF-4: 10 tickets, owner visible at once?
 await cs('6d speed: owner in first read after create (10 tickets)',async()=>{const m=[];const ow=[];for(let i=0;i<10;i++){const t=await mk(PX+' RT15SEQ speed '+i,null,{owner:null});m.push(t.ms);ow.push((await own(t.id)).owner);}return{createMs:m,maxMs:Math.max(...m),ownersAtFirstRead:ow};});
}finally{
 const b=await api('PUT',nsUrl,ns0);LED('direct master restored to found value '+ns0.direct_rules_enabled+' '+b.s);R.masterBack=(await api('GET',nsUrl)).j.data;
 const pb=await api('PUT',prefsUrl,p0);R.prefsBack=pb.s;
 for(const id of WF){const g=await api('GET','/workflow/rules/'+id);const r=await api('PUT','/workflow/rules/'+id+'/deactivate',{});R['wfOff'+id.slice(0,4)]=r.s;}
 fs.writeFileSync(OUT+'/t1-rules.json',JSON.stringify({RULES,WF},null,1));save();
}
return R;
