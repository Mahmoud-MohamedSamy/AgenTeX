const ms = D((await api('GET', '/modules')).j); const L = ms.items || ms; const con = L.find(m => /desk_contacts|^contacts$/i.test(m.moduleKey || m.key || '') || /Contacts/.test(JSON.stringify(m.labels || ''))); out.conMod = con && (con.id + ' ' + con.moduleKey);
const cr = await api('GET', '/modules/' + con.id + '/records?limit=5&q=' + encodeURIComponent('qa-ac-c1')); const c = arr(D(cr.j))[0]; out.contact = c && c.id;
if (c) { for (const p of ['/desk/contacts/' + c.id + '/tickets', '/desk/contacts/' + c.id + '/tickets?limit=100']) { const r = await api('GET', p); out[p.slice(-20)] = r.s + ' ' + Object.entries(TK).filter(([k, v]) => r.t.includes(v)).map(([k]) => k).join(',') + ' total~' + (r.t.match(/"id"/g) || []).length; }
  await go('/modules/' + con.id + '/records/' + c.id, 9000); out.ui = [...new Set(((await mtxt()).match(/QA AC [A-Z0-9]+/g) || []))].join(','); await shot('access/c-contact-page'); }
const ex = await api('POST', '/modules/' + TM + '/export', { format: 'csv', q: 'QA AC' }); out.export = ex.s + ' ' + ex.t.slice(0, 200);
return fin({ out });
