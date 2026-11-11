const U='/desk/departments/b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6/round-robin-preferences';const o=(await api('GET',U)).j.data;const R={};
for(const [k,v] of [['backlog_order','zz_invalid'],['backlog_limit',100000],['department_threshold',100000],['incoming_mode','zz_invalid']]){const r=await api('PUT',U,{...o,[k]:v});R[k]=r.s+' '+r.t.slice(0,260);}
const a=(await api('GET',U)).j.data;R.unchanged=JSON.stringify(a)===JSON.stringify(o);if(!R.unchanged){R.restore=(await api('PUT',U,o)).s;}
return R;
