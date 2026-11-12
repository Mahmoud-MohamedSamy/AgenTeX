const o = JSON.parse(fs.readFileSync('../a4/i9-out.json')); const AG = o.AG; const R = {};
const st = async () => arr((await api('GET', '/iam/users?take=200')).j?.data).find(x => x.userId === AG)?.status;
try {
  R.susp = (await api('PATCH', '/iam/users/' + AG, { status: 'suspended' })).s; await sleep(2000); R.statusNow = await st();
  const p = await api('POST', `/desk/tickets/${o.manual}/assign`, { owner_id: AG }); R.manualPatch = p.s + (p.s >= 300 ? ' ' + p.t.slice(0, 220) : '');
  await sleep(2000); R.manualOwnerSet = JSON.stringify(await getTicket(o.manual)).includes(AG);
} finally { R.reactivate = (await api('PATCH', '/iam/users/' + AG, { status: 'active' })).s; await sleep(2000); R.statusAfter = await st(); }
log(JSON.stringify(R, null, 1));
