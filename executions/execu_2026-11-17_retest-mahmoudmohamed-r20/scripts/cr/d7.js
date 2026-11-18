eval(fs.readFileSync('cr/lib.js','utf8'));
const d=(await api('GET','/desk/departments/'+D)).j?.data;const c=(await api('GET','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records/349fc131-bdf7-44a3-94b2-78f01eb8d32e')).j?.data;const cx={};for(const f of c?.data||[])cx[f.field]=val(f.value);
const rules=arr((await api('GET','/workflow/rules?take=300')).j?.data).filter(r=>r.isActive&&r.moduleId===T&&((r.departmentIds||[]).includes(D)||!(r.departmentIds||[]).length)).map(r=>[r.name,r.trigger?.kind,r.actions.map(a=>a.type).join(',')]);
return {dept:d?.name,active:d?.is_active??d?.isActive,contactFirst:cx.first_name,contactLast:cx.last_name,activeRulesOnD:rules};
