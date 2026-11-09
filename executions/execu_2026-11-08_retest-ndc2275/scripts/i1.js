eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const o={};
const ru=async q=>((await api('GET','/desk/assignment-rules?'+q)).j.data.rules||[]);
const d=await ru('type=direct'),rr=await ru('type=round_robin&department_id='+IDS.DA);
const brief=r=>({n:r.name,ex:r.execute_on,crit:(r.targets||[]).map(t=>JSON.stringify((t.criteria||{}).conditions||[]).slice(0,80))});
o.directTotal=d.length;o.directActive=d.filter(r=>r.is_active).map(r=>({...brief(r),com:(r.targets||[]).map(t=>String(t.coming_to_department_id).slice(0,8))}));
o.rrTotal=rr.length;o.rrActive=rr.filter(r=>r.is_active).map(brief);
o.prefs=await getP();fs.writeFileSync(OUT+'/prefs-before.json',JSON.stringify(o.prefs,null,1));
for(const[k,u]of[['A1',IDS.A1],['A2',IDS.A2],['A3',IDS.A3]]){const r=await api('GET','/desk/agents/'+u+'/workload');o['wl'+k]=r.s===200?JSON.stringify(r.j.data).slice(0,300):r.s;}
const n=await as('a2','GET','/notifications?limit=2');o.notif=JSON.stringify(n.j).slice(0,500);
const wf=await api('GET','/workflow/rules?moduleId='+T);o.wf=(arr(wf.j&&wf.j.data)).filter(w=>w.isActive).map(w=>w.name).slice(0,20);
const sw=await api('GET','/desk/assignment/notification-settings');o.switches=JSON.stringify(sw.j&&sw.j.data).slice(0,400);
return o;
