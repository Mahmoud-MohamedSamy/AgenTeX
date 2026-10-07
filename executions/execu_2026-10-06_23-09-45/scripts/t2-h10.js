const CLOSED = 'fc61433d-7330-4a14-a260-97e68eca9add';
const m = arr((await api('GET', '/modules')).j.data).some(x => x.id === CLOSED); const g = await api('GET', `/modules/${CLOSED}/records`);
rec('H10.recheck', 'INFO', `after the owner re-sent the permission: module listed for agent=${m}; GET records → ${g.s} (${arr(g.j && g.j.data).length} records)`);
return done();
