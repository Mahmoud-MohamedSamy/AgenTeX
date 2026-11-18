const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 140) : ''); };
out.ownerLight = await pr('POST', '/desk/tickets/' + TK.SH2 + '/assign', { owner_id: US.D });
const f = flat(D((await api('GET', '/modules/' + TM + '/records/' + TK.SH2)).j)); out.sh2owner = f.owner;
const t = await api('GET', '/desk/teams/caf9df21-1fd5-49b5-8248-f09a64c8b4c6'); out.team = JSON.stringify(D(t.j)).slice(0, 500);
const tq = await api('GET', '/desk/teams/caf9df21-1fd5-49b5-8248-f09a64c8b4c6/members'); out.members = tq.s + ' ' + tq.t.slice(0, 300);
out.teamTicket = await pr('POST', '/desk/tickets/' + TK.CSE + '/assign', { owner_id: null, team_id: 'caf9df21-1fd5-49b5-8248-f09a64c8b4c6' });
return fin({ out });
