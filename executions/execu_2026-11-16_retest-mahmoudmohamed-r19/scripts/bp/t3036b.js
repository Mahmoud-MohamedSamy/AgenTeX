const o = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3036.json', 'utf8'));
const sus = await api('PATCH', '/iam/users/' + AG_A, { status: 'suspended' }); o.suspend = E(sus); o.suspendAt = new Date().toISOString();
LED('agent "Customer Experience Specialists 2" (9d182dfa, QA account) SUSPENDED for NDC-3036: ' + o.suspend);
await sleep(4000);
const us = L((await api('GET', '/iam/users?app_key=desk&page_size=500&page=1')).j?.data).find(x => x.userId === AG_A); o.statusNow = us?.status;
const g = await getBp(o.id); o.suspended = { ownerIssues: g.ownerIssues, noActive: g.transitionsWithoutActiveOwner };
o.availSuspended = await trans(o.t1);
o.runT1 = E(await runT(o.t1, 'onlyA')); await sleep(2000); o.t1status = (await rec(o.t1)).status;
fs.writeFileSync(RUN + '/scripts/bp/3036.json', JSON.stringify(o, null, 1)); return o;
