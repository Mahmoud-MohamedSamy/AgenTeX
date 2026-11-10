const ids=['b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6','ce1d8a43-07df-4b37-891c-cc8b2eceec6f','93949fbd-f9df-4e2e-ae45-00b8dc38385b','4853562a-0b4d-45cb-ba34-9f2118fcd32c'];
const deps=(await api('GET','/desk/departments')).j?.data||[];const ag=(await api('GET','/desk/queues/agents')).j;const AL=Array.isArray(ag?.data)?ag.data:[];
const R={};
for(const d of ids){const x=deps.find(y=>y.id===d);R[d.slice(0,8)]={name:x?.name||'GONE',agents:AL.filter(a=>a.department_ids?.includes(d)).map(a=>a.name+'('+a.presence?.online+')'),
 direct:((await api('GET','/desk/assignment-rules?type=direct&department_id='+d)).j?.data?.rules||[]).map(r=>r.name+(r.is_active?'':' [off]')),
 rr:((await api('GET','/desk/assignment-rules?type=round_robin&department_id='+d)).j?.data?.rules||[]).map(r=>r.name+(r.is_active?'':' [off]'))};}
R.notif=(await api('GET','/desk/assignment/notification-settings')).t.slice(0,400);
R.skillTypes=(await api('GET','/desk/skill-types')).t.slice(0,400);
return R;
