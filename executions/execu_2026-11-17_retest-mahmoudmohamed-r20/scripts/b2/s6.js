const J = JSON.parse(fs.readFileSync(RUN + '/scripts/b2/3065.json', 'utf8'));
const r = await rec(J.t.V2); const t = (await api('GET', '/desk/tickets/' + J.t.V2)).j?.data || {};
return { owner: r.owner === AG_A ? 'CES2' : r.owner, st: t.status, prio: r.priority };
