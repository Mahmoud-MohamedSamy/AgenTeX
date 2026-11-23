const d = await api('GET', '/desk/departments/6d68dc90-7ecf-4829-bf51-9beb87282b87'); log('DD', d.s, d.j?.data?.name, d.j?.data?.is_active);
const ds = await api('GET', '/desk/departments?limit=100'); log('depts', ds.s, arr(ds.j).map(x => x.name + ' ' + x.id.slice(0,8)).join(' | '));
const ag = await api('GET', '/desk/agents/' + AG_A); log('CES2', ag.s, JSON.stringify(ag.j?.data || ag.t).slice(0, 600));
