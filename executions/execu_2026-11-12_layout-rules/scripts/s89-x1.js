const mid = await modId(); const F = await fieldsOf(mid); const st = F.find(f => f.fieldName === 'status'); const out = { status: JSON.stringify(st.datatypeOptions).slice(0, 400) };
const ex = (await rules(mid, '?layoutId=' + I.layout)).map(r => r.name + ' pf=' + r.primaryField + ' ' + r.status + ' depts=' + JSON.stringify(r.departmentIds)); out.existing = ex; return out;
