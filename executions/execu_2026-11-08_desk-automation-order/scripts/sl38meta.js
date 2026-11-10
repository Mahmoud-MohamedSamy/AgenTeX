const m=(await api('GET','/desk/sla/meta')).t;
const pl=(await api('GET','/desk/sla/support-plans?department_id=93949fbd-f9df-4e2e-ae45-00b8dc38385b')).j?.data;const one=Array.isArray(pl)?pl[0]:(pl?.plans||pl?.items||[])[0];
return {meta:m.slice(0,1500),planKeys:one?Object.keys(one).join(','):JSON.stringify(pl).slice(0,300)};
