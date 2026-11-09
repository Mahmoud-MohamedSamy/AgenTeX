const o = {}; const S = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message).slice(0, 200) : null });
const DA = '44444444-4444-4444-4444-444444444402';
// W1-41 rename built-in Desk Agent and back
const p0 = await api('GET', '/iam/profiles/' + DA); o.before = p0.j && p0.j.data && p0.j.data.name;
o.rename = S(await api('PATCH', '/iam/profiles/' + DA, { name: 'Desk Agent QA' }));
const p1 = await api('GET', '/iam/profiles/' + DA); o.afterRename = p1.j && p1.j.data && p1.j.data.name;
if (o.afterRename !== o.before) o.restore = S(await api('PATCH', '/iam/profiles/' + DA, { name: o.before }));
const p2 = await api('GET', '/iam/profiles/' + DA); o.final = p2.j && p2.j.data && p2.j.data.name;
// W1-12 delete default BH
const bh = await api('GET', '/iam/tenant/business-hours/profiles'); const def = (bh.j.data || []).find(x => x.is_default); o.defId = def && def.id;
o.bhDelete = S(await api('DELETE', '/iam/tenant/business-hours/profiles/' + def.id));
const bh2 = await api('GET', '/iam/tenant/business-hours/profiles'); o.bhAfter = (bh2.j.data || []).map(x => x.name + (x.is_default ? '*' : '') + ':' + x.id.slice(0, 8));
// W1-58 signature: discover shape
o.sigPut1 = S(await api('PUT', '/mail/signatures/me', { department_id: null, body_html: '<p>QA GL N signature</p>' }));
const g1 = await api('GET', '/mail/signatures/me'); o.sigList1 = JSON.stringify(g1.j && g1.j.data).slice(0, 300);
return done(o);
