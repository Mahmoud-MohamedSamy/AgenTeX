eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/as/sklib.js','utf8'));
const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));save('a2933.json',R);};
R.list=((await api('GET','/desk/skills?department_id='+D)).j?.data?.skills||[]).map(s=>s.name.slice(0,40)+' act='+s.is_active);
const t=await tk('2933 api mixed',{owner:null,skills:['QA RT19 SK S1','QA RT19 SK Inact','QA SK13 S1','QA SK12 Inact']});
if(typeof t!=='string'){S('create ERR',JSON.stringify(t));return R;}I.TAPI=t;saveI();
S('create #'+(await num(t))+' with S1 + Inact + QA SK13 S1 + QA SK12 Inact -> kept',await sk(t));
let p=await patch(t,{skills:['QA RT19 SK S2','QA RT19 SK Inact','QA SK13 S2']});S('PATCH S2+Inact+QA SK13 S2 ->',E(p),'kept',await sk(t));
p=await patch(t,{skills:['QA SK13 S3']});S('PATCH only other dept ->',E(p),'kept',await sk(t));
// temp skill: add to ticket while active, then deactivate -> ticket for UI "still shows so you can remove"
const mk=await api('POST','/desk/skills?department_id='+D,{department_id:D,name:'QA RT20 AS Tmp',type_id:I19.TYPE,description:'QA RT20 AS lane',is_active:true,criteria:{conditions:[{field_key:'subject',operator:'contains',value:'QART20ASNEVER'}],pattern:null}});
const sid=mk.j?.data?.id;S('temp skill',E(mk),sid);if(sid){I.TMP=sid;saveI();LED('skill created '+sid+' "QA RT20 AS Tmp" active dept QA RT19 SK Dept');}
const t2=await tk('2933 ui ticket',{owner:null,skills:['QA RT19 SK S1','QA RT20 AS Tmp']});I.TUI=t2;saveI();
S('ui ticket #'+(await num(t2))+' skills',await sk(t2));
if(sid){const g=(await api('GET','/desk/skills?department_id='+D)).j?.data?.skills.find(s=>s.id===sid);const d=await api('PUT','/desk/skills/'+sid,{...g,is_active:false});S('deactivate tmp',E(d));LED('skill '+sid+' set inactive');}
S('ui ticket after deactivation skills',await sk(t2));
return R;
