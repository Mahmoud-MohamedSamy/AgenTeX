eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/sk/lib.js','utf8'));
const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));save('t2971b.json',R);};
S('#'+(await num(I.TDEL))+' before delete',await sk(I.TDEL));
if(!I.DELETED){const d=await api('DELETE','/desk/skills/'+I.DEL);S('DELETE skill QA RT19 SK Del',E(d));if(d.s<300){I.DELETED=true;saveI();LED('skill '+I.DEL+' "QA RT19 SK Del" deleted (NDC-2971)');}await sleep(3000);}
S('skills of dept now',((await api('GET','/desk/skills?department_id='+D)).j?.data?.skills||[]).map(s=>s.name.slice(0,20)).join(', '));
S('#'+(await num(I.TDEL))+' after delete (record GET)',await sk(I.TDEL));
S('ticket skills tab GET',(await api('GET','/desk/tickets/'+I.TDEL+'/skills')).t.slice(0,400));
const c=await tk('2971 create with deleted skill',{owner:A3,skills:['QA RT19 SK Del','QA RT19 SK S1']});S('create with deleted skill ->',typeof c==='string'?'201 kept '+(await sk(c)):JSON.stringify(c));
const p=await patch(I.TDEL,{skills:['QA RT19 SK S1','QA RT19 SK Del']});S('PATCH #TDEL with deleted skill ->',E(p),'now',await sk(I.TDEL));
const g=await api('GET','/workflow/rules/'+I.WF);S('wf saved keys after delete',JSON.stringify((g.j?.data?.actions||[]).map(a=>a.type+':'+JSON.stringify(a.skillKeys))));
return R;
