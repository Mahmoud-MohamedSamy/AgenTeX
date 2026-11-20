const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8')); const o = {};
for (const [n, id] of [['4181', '7e784fc0-821d-4a80-8c12-3bfe25a6e89d'], ['4182', '4ad8caa5-4f11-404c-b25b-8235103d4090'], ['4808', J.k1]]) { const t = await api('GET', '/desk/tickets/' + id); const d = t.j?.data || {}; const r = await rec(id); o[n] = [t.s, 'dept=' + String(d.department_id || r.department).slice(0, 8), 'st=' + (d.status || r.status), 'owner=' + (r.owner === OWNER ? 'OWNER' : r.owner), 'deleted=' + d.is_deleted, 'closed=' + (d.closed_at || ''), 'shares=' + JSON.stringify(d.shares || '').slice(0, 80)].join(' '); }
const sh = await api('GET', '/desk/tickets/7e784fc0-821d-4a80-8c12-3bfe25a6e89d/shares'); o.sh4181 = E(sh) + ' ' + sh.t.slice(0, 200);
o.ownerRunR3onlyA = E(await runT(J.r3, 'onlyA')); await sleep(1500); o.r3after = (await api('GET', '/desk/tickets/' + J.r3)).j?.data?.status;
LED('owner ran onlyA on #4807 (60968417) -> ' + o.r3after + ' (no-owner rule check)');
return o;
