const o = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3036.json', 'utf8'));
o.reactivate = E(await api('PATCH', '/iam/users/' + AG_A, { status: 'active' })); o.reactAt = new Date().toISOString(); await sleep(4000);
const us = L((await api('GET', '/iam/users?app_key=desk&page_size=500&page=1')).j?.data).find(x => x.userId === AG_A); o.statusAfter = us?.status;
LED('agent "Customer Experience Specialists 2" (9d182dfa) REACTIVATED: ' + o.reactivate + ', status now ' + o.statusAfter + ' (suspended ' + o.suspendAt.slice(11, 19) + 'Z to ' + o.reactAt.slice(11, 19) + 'Z)');
const g = await getBp(o.id); o.after = { ownerIssues: g.ownerIssues, noActive: g.transitionsWithoutActiveOwner };
o.availT2after = await trans(o.t2); o.runT2after = E(await runT(o.t2, 'onlyA'));
fs.writeFileSync(RUN + '/scripts/bp/3036.json', JSON.stringify(o, null, 1)); return o;
