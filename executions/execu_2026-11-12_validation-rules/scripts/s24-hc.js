const k = I.hcKey, f = I.hcForm; const out = {};
for (const p of ['/forms/' + f + '/submit', '/forms/' + f + '/submissions', '/forms/' + f + '/tickets', '/tickets', '/submit']) { const x = await api('POST', '/help-center/public/' + k + p, {}); out[p] = x.s + ' ' + x.t.slice(0, 250); }
const mid = await modId(); const Ls = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data);
out.layouts = Ls.map(l => [l.id.slice(0, 8), l.name, (l.departmentIds || []).length, (l.defaultDepartmentIds || []).includes('7e1ac409-58b0-41ab-97e1-0e7d5c8c5158') ? 'DEFAULT-CS' : ((l.departmentIds || []).includes('7e1ac409-58b0-41ab-97e1-0e7d5c8c5158') ? 'cs' : ''), l.displayInHelpCenter].join('|'));
return out;
