const o = {}; const TK = 'd564fa1f-7b42-4710-94ab-e49de784519a', TECH = '19510fdc'; const deps = (await api('GET', '/desk/departments')).j.data; const tech = deps.find(d => d.name === 'Tech').id; o.tech = tech;
const bodies = [{ shares: [{ department_id: tech, access_level: 'read_only' }] }, { items: [{ department_id: tech, access_level: 'read_only' }] }, { shares: [{ department_id: tech, access: 'read_only' }] }, [{ department_id: tech, access_level: 'read_only' }]];
for (let i = 0; i < bodies.length; i++) { const r = await api('PUT', '/desk/tickets/' + TK + '/shares', bodies[i]); o['b' + i] = r.s + ' ' + JSON.stringify(r.j && (r.j.error || r.j.data)).slice(0, 220); if (r.s < 300) break; }
return done(o);
