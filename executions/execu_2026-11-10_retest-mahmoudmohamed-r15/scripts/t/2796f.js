const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const T='88e8ea44-1658-4df3-9930-d0902b91073d', ADM='d1e6505d-ad05-45d0-bd8a-8f3f1eca96cb';
const bk = JSON.parse(fs.readFileSync(RUN+'/out/2796-adm-layout-backup.json','utf8'));
const cur = (await api('GET','/modules/'+T+'/layouts/'+ADM)).j.data; cur.departmentIds = bk.departmentIds; cur.defaultDepartmentIds = bk.defaultDepartmentIds;
const r = await api('PUT','/modules/'+T+'/layouts/'+ADM, cur); LED('layout QA NDC ADM departments restored to backup ('+JSON.stringify(bk.departmentIds)+') PUT '+r.s);
const a = (await api('GET','/modules/'+T+'/layouts/'+ADM)).j.data; return {put:r.s, depts:a.departmentIds, defaults:a.defaultDepartmentIds};
