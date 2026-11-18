const TE = '1499272000000006907';
const r = await api(page, 'POST', 'teams', { name: 'QA AC2 Control Team', departmentId: TE, description: 'access run, delete after', agents: ['1499272000000432034'] }); out.ctl = r.s + ' ' + r.t.slice(0, 160); out.id = r.j && r.j.id;
if (out.id) out.del = (await api(page, 'DELETE', 'teams/' + out.id)).s;
