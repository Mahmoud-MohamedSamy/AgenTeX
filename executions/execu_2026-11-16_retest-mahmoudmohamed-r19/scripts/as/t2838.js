var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
// NDC-2838: old ticket #1 (created 7 Oct, >30 days, no customer reply) reopened, moved to QA AS6 Dept A, owner cleared, subject prefixed so only our rule matches.
// Expect: RR holds it back and History says "Not assigned by round robin" + rule + "No customer reply in the last 30 days". Control new ticket -> A3. Then Assign backlogs on: still held, check entries. Restore #1 fully.
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const OLD=process.env.OLD||'aad34749';const R={steps:[]};const S=(...a)=>R.steps.push(a.join(' '));
const L=arr((await api('GET','/modules/'+T+'/records?page=1&page_size=40&sort_by=created_at&sort_order=asc')).j?.data);const row=L.find(x=>x.id.startsWith(OLD));const ID=row.id;
const o0=await rec(ID);const ORIG={subject:o0.subject,status:o0.status,department:o0.department,owner:o0.owner};save('t2838-orig.json',{id:ID,num:o0.ticket_number,...ORIG,created:row.created_at});
S('old ticket #'+o0.ticket_number,'created',row.created_at,'orig',JSON.stringify({...ORIG,department:nm(ORIG.department),owner:nm(ORIG.owner)}));
const P0=await prefs(DA);const K='R19AS38'+U;let rid;
try{
 S('prefs',E(await setPrefs({...P0,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,agent_thresholds:[],assign_backlogs:false,assign_on_closure:false})));
 const r=await rule('round_robin','2838 30day',[rrT(K,'sequential',[A3])],{on:['create','update']});rid=r.j?.data?.id;S('rule',E(r));await sleep(2500);
 // 1) reopen + move + clear owner + subject (one edit), like the bug's steps
 const p0=await patch(ID,{status:'Open',subject:PFX+' '+K+' old ticket '+(ORIG.subject||'')});S('1a) reopen + subject',p0.s,p0.s>=300?p0.t.slice(0,300):'');await sleep(2000);
 const mv=await api('POST','/desk/tickets/'+ID+'/move',{department_id:DA});S('1b) move to Dept A',E(mv));await sleep(2000);
 const un=await api('POST','/desk/tickets/'+ID+'/assign',{owner_id:null,team_id:null});S('1c) unassign',E(un));const p={s:Math.max(p0.s,mv.s,un.s)};
 S('1) edit old ticket',p.s);await sleep(20000);S('1) old ticket owner after 20 s',await own(ID));
 // 2) control new ticket
 const t=await tk(K+' new control');S('2) new control ->',await waitOwn(t,24));R.control=t;
 // 3) assign backlogs on, 90 s
 S('3) prefs backlogs on',E(await setPrefs({...P0,assign_to_offline_agents:true,department_threshold_enabled:false,assign_backlogs:true,assign_on_closure:false})));
 await sleep(90000);S('3) old ticket after 90 s of Assign backlogs',await own(ID));
 const f=await feed(ID);R.feed=f.slice(0,12).map(e=>e.occurred_at.slice(11,19)+' '+e.action+' '+JSON.stringify(e.summary||{}).slice(0,260));
 R.held=f.filter(e=>/not_assigned|held|skipp|30/i.test(e.action+JSON.stringify(e.summary||{}))).length;
}finally{
 if(rid)await setA(rid,false);
 R.restorePrefs=E(await setPrefs(P0));
 R.restoreTicket=[E(await api('POST','/desk/tickets/'+ID+'/move',{department_id:ORIG.department})),E(await api('POST','/desk/tickets/'+ID+'/assign',{owner_id:ORIG.owner,team_id:null})),(await patch(ID,{subject:ORIG.subject,status:ORIG.status})).s].join('/');
 const o1=await rec(ID);R.after={subject:o1.subject,status:o1.status,dept:nm(o1.department),owner:nm(o1.owner)};
 LED('ticket #'+o0.ticket_number+' restored (subject/dept/owner/status) '+JSON.stringify(R.after)+'; QA AS6 Dept A prefs restored '+R.restorePrefs);
}
save('t2838.json',R);return R;
