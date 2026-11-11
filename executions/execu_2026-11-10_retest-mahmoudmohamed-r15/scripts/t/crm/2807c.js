const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
let r = await api('POST','/modules/'+L+'/views',{ name:'QA RT15 2807 view', kind:'list', visibility:'private', settings:{ columns:['first_name','last_name','lead_source','owner','created_at'], criteria:{ pattern:'1 and 2', conditions:[{field:'first_name',operator:'equals',value:'QA RT15'},{field:'last_name',operator:'starts_with',value:'2807'}] } } });
const vid = r.j&&r.j.data&&(r.j.data.id||(r.j.data.view&&r.j.data.view.id));
if (vid) fs.appendFileSync(RUN+'/ledger-crm.md','- '+new Date().toISOString().slice(0,19)+' CRM Leads view "QA RT15 2807 view" '+vid+'\n');
const c = await api('GET','/modules/'+L+'/records?page=1&per_page=1&view_id='+vid);
return { s:r.s, vid, err: r.s>=300? r.t.slice(0,400):'', count: c.s+' '+JSON.stringify(c.j&&c.j.meta).slice(0,300) };
