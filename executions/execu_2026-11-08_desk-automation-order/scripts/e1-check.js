// E2E-1 read-only pre-check.
eval(fs.readFileSync('lib-as.js','utf8'));
const R={DA};
const d=(await api('GET','/desk/departments/'+DA)).j?.data;R.dept={name:d?.name,visibility:d?.visibility,help:d?.display_in_help_center??d?.is_public};
const cs=(await api('GET','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records?limit=20&search='+encodeURIComponent('qaao'))).j?.data;const L=Array.isArray(cs)?cs:(cs?.items||cs?.records||[]);R.contacts=L.length;
const hc=(await api('GET','/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389')).j?.data;R.hc={name:hc?.name,depts:hc?.department_ids||hc?.departments?.map?.(x=>x.name||x)};
const hs=(await api('GET','/desk/customer-happiness/settings')).j;R.happiness=hs?.data?{enabled:hs.data.enabled??hs.data.is_enabled,scope:hs.data.department_ids||hs.data.scope}:hs?.error?.code;
R.presence=await presence();
const wf=(await api('GET','/desk/web-forms/b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6')).s;R.formGet=wf;
return R;
