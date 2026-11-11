// MODE=public|private: QA AO Dept A "Display in Help Center" for SL-18 (restore private after).
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b';const d=(await api('GET','/desk/departments/'+A)).j.data;const R={before:d.visibility};
const r=await api('PATCH','/desk/departments/'+A,{name:d.name,display_in_help_center:process.env.MODE==='public'});R.patch=r.s+(r.s>=300?' '+r.t.slice(0,200):'');
const n=(await api('GET','/desk/departments/'+A)).j.data;R.after=n.visibility;R.agentsSame=n.agent_user_ids.length===d.agent_user_ids.length;R.served=(await api('GET','/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/served-departments')).j?.data?.department_ids?.includes(A);
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' SL-18 portal: QA AO Dept A visibility '+R.before+' -> '+R.after+(R.after==='public'?' (restore to private after)':' (restored)')+'.\n');return R;
