const o = JSON.parse(fs.readFileSync('../a4/i9-out.json')); const AG = o.AG; const R = {};
const st = async () => arr((await api('GET', '/iam/users?take=200')).j?.data).find(x => x.userId === AG)?.status;
for (const v of ['suspended', 'Suspended', 'inactive']) { const r = await api('PATCH', '/iam/users/' + AG, { status: v }); R['patch ' + v] = r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); await sleep(2000); R['now ' + v] = await st(); if (/suspend|inactive|disabled/i.test(R['now ' + v] || '')) break; }
log(JSON.stringify(R));
