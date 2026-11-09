const o = await api('o', 'GET', '/emails/sendability'); const u = await api('u1', 'GET', '/emails/sendability');
const c = arr((await api('o', 'GET', '/mail/connections')).j?.data).map(x => ({ provider: x.provider, keys: Object.keys(x).slice(0, 25), domain: x.domain || x.sender_domain || x.domains, can: x.can_send, health: x.health?.result, scope: x.scope || x.owner_type }));
return { owner: o.s + ' ' + o.t.replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 500), u1: u.s + ' ' + u.t.replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 500), conns: c };
