// Step 8 extras: contact, sk2 restore, Dept A back to private, check no E1 data left.
eval(fs.readFileSync('lib-as.js','utf8'));const M=JSON.parse(fs.readFileSync('../e1.json','utf8'));const R={};
R.contact=(await api('DELETE','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records/'+M.contact)).s;
const SO=JSON.parse(fs.readFileSync('../pb-skill-orig.json','utf8'));R.skills=[];for(const x of SO)R.skills.push((await api('PUT','/desk/skills/'+x.id+'?department_id='+DA,{name:x.name,type_id:x.type_id,description:x.description,is_active:x.is_active,criteria:x.criteria,agent_ids:x.agent_ids})).s);
const d=(await api('GET','/desk/departments/'+DA)).j.data;const p=await api('PATCH','/desk/departments/'+DA,{name:d.name,display_in_help_center:false});const n=(await api('GET','/desk/departments/'+DA)).j.data;R.dept=d.visibility+' -> '+n.visibility+' ('+p.s+')';R.agentsSame=n.agent_user_ids?.length===d.agent_user_ids?.length;
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' E2E-1 cleanup: contact deleted ('+R.contact+'), sk1/sk2 restored, Dept A '+R.dept+'.\n');
const left=async q=>{const s=(await api('GET','/modules/'+T+'/records?limit=50&search='+encodeURIComponent(q))).j?.data;const L=Array.isArray(s)?s:(s?.items||s?.records||[]);return L.filter(x=>JSON.stringify(x).includes(q)).length;};
R.ticketsLeft={E1a3t5:await left('E1a3t5'),'E1 control':await left('QA AO E1 control'),'E1 7c':await left('QA AO E1 7c')};
const c=(await api('GET','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records/'+M.contact)).s;R.contactGet=c;
const iv=await api('POST','/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/invitations/contacts',{contact_ids:[M.contact]});R.portalProbe=iv.s+' '+JSON.stringify((iv.j?.data||[]).map(x=>x.outcome)).slice(0,100);
return R;
