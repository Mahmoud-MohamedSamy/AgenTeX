const mi = D((await api('GET', '/desk/departments/95a6fd64-b877-435e-8e23-62c75717f95f')).j); out.bInMI = (mi.agent_user_ids || []).includes(US.B);
out.r4b = (await api('GET', '/desk/tickets/' + TK.R4b + '/sla')).t.slice(0, 300);
const ps = arr(D((await api('GET', '/desk/sla/policies?department_id=' + DEP.MKT)).j)); out.pol = ps.map(p => p.name + ' active:' + p.is_active).join(' ; ');
const bh = await api('GET', '/desk/sla/settings?department_id=' + DEP.MKT); out.set = bh.s + ' ' + bh.t.slice(0, 300);
return fin({ out });
