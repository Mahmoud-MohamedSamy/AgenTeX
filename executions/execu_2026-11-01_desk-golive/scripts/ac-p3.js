const pid = 'b1050a28-bda8-47ea-846d-12b34430d84c'; const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + ' ' + r.t.slice(0, 100); };
out.d1 = await pr('DELETE', '/iam/profiles/' + pid + '/permissions/' + encodeURIComponent('desk:ticket:all_departments'));
out.d2 = await pr('DELETE', '/iam/profiles/' + pid + '/permissions/' + encodeURIComponent('desk:ticket:move'));
out.g = await pr('POST', '/iam/profiles/' + pid + '/permissions', { permission_key: 'desk:ticket:view_unassigned', effect: 'DENY' });
out.eff = (D((await api('GET', '/iam/profiles/' + pid + '/effective')).j) || []).filter(k => /desk:ticket:/.test(k)).map(k => k.slice(12)).join(' ');
out.as = await pr('POST', '/iam/users/' + US.D + '/profiles', { profile_id: pid, scope_id: 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd', replace: true });
const r = await mk(TM, 'ticket', 'QA AC CSU2', { subject: 'QA AC CSU2 access run', department: DEP.CS, status: 'Open', email: 'qa-ac-c1@example.com', channel: 'phone' }); out.csu2 = r.id;
if (r.id) out.un = await pr('POST', '/desk/tickets/' + r.id + '/assign', { owner_id: null });
return fin({ out });
