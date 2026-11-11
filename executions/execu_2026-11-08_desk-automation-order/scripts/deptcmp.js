const a=(await api('GET','/desk/departments/93949fbd-f9df-4e2e-ae45-00b8dc38385b')).j.data;const b=(await api('GET','/desk/departments/7e1ac409-58b0-41ab-97e1-0e7d5c8c5158')).j.data;
const diff={};for(const k of new Set([...Object.keys(a),...Object.keys(b)])){if(/agent_user_ids|id$|name|created|updated|row_version|description|email/.test(k))continue;if(JSON.stringify(a[k])!==JSON.stringify(b[k]))diff[k]={QA_AO_A:JSON.stringify(a[k]).slice(0,120),CustSupport:JSON.stringify(b[k]).slice(0,120)};}
return {keys:Object.keys(a).join(','),diff};
