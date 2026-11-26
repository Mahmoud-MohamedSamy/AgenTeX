const p = await api('GET', '/salesiq/operators/me/profile'); const d = p.j?.data;
const c = await api('GET', '/salesiq/conversations/counts'); const l = arr((await api('GET', '/salesiq/conversations')).j?.data);
const st = await api('GET', '/agents/tia/status?app=salesiq');
return { prof: p.s, role: d?.role || d?.operator_role, depts: JSON.stringify(d?.departments || d?.department_ids || d?.departmentIds || null).slice(0, 160), counts: c.s + ' ' + JSON.stringify(c.j?.data).slice(0, 120), listN: l.length, deptsInList: [...new Set(l.map(x => x.channel_instance_department))].slice(0, 6), tia: st.s === 200 ? st.j?.data?.available : st.s };
