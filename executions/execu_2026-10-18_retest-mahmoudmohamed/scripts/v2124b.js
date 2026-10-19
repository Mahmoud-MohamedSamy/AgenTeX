const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = { ids: [] };
const r = await api('GET', '/modules/' + L + '/list-preferences'); out.backup = r.j.data.prefs;
for (let i = 1; i <= 51; i++) { const n = 'QA RT ov-' + String(i).padStart(2, '0'); const p = await api('POST', '/modules/' + L + '/views', { name: n, kind: 'list', visibility: 'private', settings: { columns: ['first_name', 'phone', 'lead_status', 'owner', 'created_at'] } }); out.ids.push(p.s === 201 ? p.j.data.id : 'ERR ' + p.s + ' ' + p.t.slice(0, 120)); }
return done(out);
