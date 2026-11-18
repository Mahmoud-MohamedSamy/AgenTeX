const o = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3036.json', 'utf8')); const r = {};
r.t3 = await mkT('3036 onlyA', 'ticket 3'); await waitIn(r.t3); r.n3 = (await rec(r.t3)).ticket_number;
for (const w of [0, 60, 120]) { if (w) await sleep(60000); const g = await getBp(o.id); r['at' + w] = { at: new Date().toISOString().slice(11, 19), noActive: g.transitionsWithoutActiveOwner, issues: (g.ownerIssues || []).map(x => x.reason), avail: await trans(r.t3) }; }
const us = L((await api('GET', '/iam/users?app_key=desk&page_size=500&page=1')).j?.data).find(x => x.userId === AG_A); r.statusA = us?.status;
o.recheck = r; fs.writeFileSync(RUN + '/scripts/bp/3036.json', JSON.stringify(o, null, 1)); return r;
