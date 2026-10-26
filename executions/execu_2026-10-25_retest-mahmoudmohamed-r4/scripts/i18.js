const B = '/desk/integrations/crm';
const P = ['44444444-4444-4444-4444-444444444401', '44444444-4444-4444-4444-444444444402', '44444444-4444-4444-4444-444444444403', '44444444-4444-4444-4444-444444444404', '44444444-4444-4444-4444-444444444405'];
const full = { enabled: true, info: true, potentials: true, notes: true, activities: ['calls', 'meetings', 'tasks'] }, none = { enabled: false, info: false, potentials: false, notes: false, activities: [] };
const c = (await api('GET', `${B}/config`)).j.data; const b = JSON.parse(JSON.stringify(c)); delete b.status;
b.panel.profile_access = P.map(p => ({ profile_id: p, enabled: true, contacts: p.endsWith('402') ? none : full, accounts: p.endsWith('402') ? none : full }));
const r = await api('PUT', `${B}/config`, b);
return done({ put: r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 250) : ''), now: JSON.stringify((await api('GET', `${B}/config`)).j.data.panel.profile_access).slice(0, 200) });
