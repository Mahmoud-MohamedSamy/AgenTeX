// A-10 / E-17: tenant round-robin switch off (user OK 10 Nov), back on in finally. QA AS6 Dept A. Cleans the failed first run too.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};
const P0={...(await prefs()),assign_backlogs:false,backlog_limit:10};R.prefsFix=E(await setPrefs(P0));
const old=((await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)).j?.data?.rules||[]).filter(x=>/^QA AO /.test(x.name));for(const x of old)await api('DELETE','/desk/assignment-rules/'+x.id);
for(const id of made.tickets.filter(x=>typeof x==='string'))await api('DELETE','/modules/'+T+'/records/'+id);made.tickets=[];saveMade();
const orig=await notif();const k='AOA10'+U;let t1=null,t2=null;R.presence=await presence();
const r=await rule('round_robin','A10',[rrT(k,'sequential')]);
try{
 R.off=(await api('PUT','/desk/assignment/notification-settings',{...orig,round_robin_rules_enabled:false})).s;
 R.ruleStillListedActive=!!(await getRule(r.j.data.id))?.is_active;
 t1=await tk(k+' off');await sleep(15000);R['A-10 new ticket while off']=await own(t1);
 await setPrefs({...P0,assign_backlogs:true,backlog_limit:5});await sleep(75000);R['E-17 waiting ticket while off (75 s, backlogs on)']=await own(t1);
}finally{R.on=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.rrSwitchAfter=(await notif()).round_robin_rules_enabled;}
t2=await tk(k+' on');R['after on: new ticket']=await waitOwn(t2,20);R['after on: waiting ticket']=await waitOwn(t1,120);
R.prefs=E(await setPrefs(P0));R.ruleDel=(await api('DELETE','/desk/assignment-rules/'+r.j.data.id)).s;
for(const id of [t1,t2])R['del '+id.slice(0,6)]=(await api('DELETE','/modules/'+T+'/records/'+id)).s;made.tickets=[];made.rules=[];saveMade();
return R;
