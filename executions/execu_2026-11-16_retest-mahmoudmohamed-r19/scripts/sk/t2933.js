eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/sk/lib.js','utf8'));
const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));save('t2933.json',R);};
const t=await tk('2933 api mixed',{owner:A3,skills:['QA RT19 SK S1','QA RT19 SK Inact','QA SK13 S1','QA SK12 Inact']});
if(typeof t!=='string'){S('create ERR',JSON.stringify(t));return R;}R.t=t;
S('create #'+(await num(t))+' with S1 + RT19 SK Inact (inactive) + QA SK13 S1 (other dept) + QA SK12 Inact (other dept, inactive) -> kept',await sk(t));
const p=await patch(t,{skills:['QA RT19 SK S2','QA RT19 SK Inact','QA SK13 S2']});S('PATCH to S2 + Inact + QA SK13 S2 ->',E(p),'kept',await sk(t));
const p2=await patch(t,{skills:['QA SK13 S3']});S('PATCH only another dept skill ->',E(p2),'kept',await sk(t));
return R;
