const r = await api(page, 'GET', 'mailReplyAddress?departmentId=1499272000000006907');
out.addr = (r.j && r.j.data || []).map(a => ({ address: a.address || a.emailAddress || a.replyAddress, dn: a.displayName, verified: a.isVerified, def: a.isDepartmentDefault }));
const s = await api(page, 'GET', 'supportEmailAddress?departmentId=1499272000000006907'); out.support = s.s + ' ' + s.t.slice(0, 300);
