eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/scripts/lib.js','utf8'));
const o={fail:[]};const C=m=>LED('CLEANUP '+m);
const del=async(p,label)=>{const r=await api('DELETE',p);if(r.s===429)throw new Error('429 stop at '+label);if(r.s>=300&&r.s!==404)o.fail.push(label+' '+r.s+' '+(E(r)||''));return r.s;};
let tk=0;for(const id of IDS.tickets){const s=await del('/modules/'+T+'/records/'+id,'ticket '+id.slice(0,8));if(s<300)tk++;}o.tickets=tk+' of '+IDS.tickets.length;C('tickets deleted '+o.tickets);
o.layout=await del('/modules/'+T+'/layouts/'+IDS.layout,'layout');C('layout QA RT9 2174 Layout: '+o.layout);
o.fields={};for(const k of ['fDec','fDef','fPick','fLk']){o.fields[k]=await del('/modules/'+T+'/fields/'+IDS[k],'field '+k);}C('fields qa_rt9_*: '+JSON.stringify(o.fields));
const a=await api('PATCH','/desk/departments/'+IDS.dept,{name:'QA RT9 2174 Dept',agent_user_ids:[]});o.deptAgents=a.s;o.dept=await del('/desk/departments/'+IDS.dept,'department');C('department QA RT9 2174 Dept: agents '+a.s+', delete '+o.dept);
// verify
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data);o.fieldsLeft=F.filter(f=>/^qa_rt9_/.test(f.fieldName)).map(f=>f.fieldName+' '+f.status);
const L=arr((await api('GET','/modules/'+T+'/layouts')).j.data);o.layoutLeft=L.filter(l=>l.id===IDS.layout).length;
const D=arr((await api('GET','/desk/departments')).j.data);o.deptLeft=D.filter(d=>d.id===IDS.dept).length;
let tl=0;for(const id of IDS.tickets){const r=await api('GET','/modules/'+T+'/records/'+id);if(r.s===200)tl++;}o.ticketsLeft=tl;
return o;
