eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/scripts/lib.js','utf8'));
const o={};const me=await api('GET','/iam/me');const md=me.j&&me.j.data;o.meKeys=md&&Object.keys(md).slice(0,15);IDS.me=md&&(md.userId||md.id||md.user_id);
if(!IDS.dept){const r=await api('POST','/desk/departments',{name:'QA RT9 2174 Dept',agent_user_ids:[IDS.me],visibility:'public'});o.dept=sh(r);const id=r.j&&r.j.data&&(r.j.data.id||r.j.data.department&&r.j.data.department.id);if(id){IDS.dept=id;LED('department "QA RT9 2174 Dept" '+id);}saveIds();}
const src=await api('GET','/modules/'+T+'/layouts/0dabc9a3-c7f2-4f74-bd1b-9e21373a6c06');const L=src.j&&src.j.data;o.srcKeys=L&&Object.keys(L);
if(!IDS.layout&&L&&IDS.dept){const b={name:'QA RT9 2174 Layout',views:L.views,dependencies:[],departmentIds:[IDS.dept],description:'QA retest 9 Nov - safe to delete'};
 const r=await api('POST','/modules/'+T+'/layouts',b);o.layout=sh(r);const id=r.j&&r.j.data&&(r.j.data.id||r.j.data.layoutId);if(id){IDS.layout=id;LED('layout "QA RT9 2174 Layout" '+id);}saveIds();}
if(IDS.layout){const g=await api('GET','/modules/'+T+'/layouts/'+IDS.layout);const d=g.j&&g.j.data;o.check=d&&{name:d.name,depts:d.departmentIds,ts:d.ticketStatuses,views:Object.keys(d.views||{})};}
o.IDS=IDS;return o;
