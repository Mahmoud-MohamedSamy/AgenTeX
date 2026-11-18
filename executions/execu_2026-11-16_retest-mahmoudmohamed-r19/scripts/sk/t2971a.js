eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/sk/lib.js','utf8'));
const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));save('t2971a.json',R);};
const crit={kind:'StringMatch',field:'subject',operator:'StartsWith',stringValue:'QA RT19 SK WF ',caseInsensitive:false};
const mkwf=async(name,deps,keys)=>{const b={moduleId:T,departmentIds:deps,name,description:'QA RT19 SK lane',isActive:false,mode:'Recurring',trigger:{kind:'RecordCreated'},criteria:crit,actions:[{type:'AddTicketSkills',order:0,delaySeconds:0,skillKeys:keys},{type:'RemoveTicketSkills',order:1,delaySeconds:0,skillKeys:keys}]};
 const r=await api('POST','/workflow/rules',b);const id=r.j?.data?.id;if(id)LED('workflow rule "'+name+'" '+id+' created inactive');return {r,id};};
if(!I.WF){const x=await mkwf('QA RT19 SK WF skills',[D],['QA RT19 SK S1','QA RT19 SK Del','QA RT19 SK Inact']);S('wf dept rule',E(x.r));if(x.id){I.WF=x.id;saveI();}}
if(!I.WF0){const x=await mkwf('QA RT19 SK WF any dept',[],['QA RT19 SK S2','QA RT19 SK Del']);S('wf no-dept rule',E(x.r));if(x.id){I.WF0=x.id;saveI();}}
const g=await api('GET','/workflow/rules/'+I.WF);S('wf saved keys',JSON.stringify((g.j?.data?.actions||[]).map(a=>a.type+':'+JSON.stringify(a.skillKeys))));
// ticket with Del before deletion (owner set so RR does not touch it)
if(typeof I.TDEL!=='string'){const t=await tk('2971 has Del before delete',{owner:A3,skills:['QA RT19 SK Del','QA RT19 SK S1']});I.TDEL=t;saveI();}
S('ticket #'+(await num(I.TDEL))+' before delete',await sk(I.TDEL));
return R;
