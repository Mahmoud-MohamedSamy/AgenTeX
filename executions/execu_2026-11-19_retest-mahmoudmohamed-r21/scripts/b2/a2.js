const J = JSON.parse(fs.readFileSync(RUN + '/scripts/b2/3065.json', 'utf8')); const o = {};
const full = r => r.s + ' ' + (r.j?.error?.code || '') + ' "' + String(r.j?.error?.message || (r.s < 300 ? '' : r.t)).slice(0, 160) + '"';
o.editK1 = full(await api('PATCH', '/modules/' + TK + '/records/' + J.t.K1, { data: fields({ priority: 'High' }) }));
for (const [k, tid] of [['K1', 'onlyA'], ['K3', 'onlyA'], ['SR', 'onlyA'], ['SX', 'onlyA'], ['SN', 'onlyA'], ['K2', 'onlyA'], ['SF', 'onlyA'], ['XF', 'xd'], ['XR', 'xd']]) {
  const r = await runT(J.t[k], tid); o['run' + k] = J.n[k] + ' ' + full(r); LED('as CES2 API run ' + tid + ' on ' + J.n[k] + ' (' + k + '): ' + r.s);
}
await sleep(4000);
for (const k of Object.keys(J.t)) { const t = await api('GET', '/desk/tickets/' + J.t[k]); const tr = await trans(J.t[k]); o['after' + k] = J.n[k] + ' open=' + t.s + ' st=' + (t.j?.data?.status || '-') + ' perms=' + (t.j?.data?.permissions || '-') + ' trans=' + JSON.stringify(tr); }
return o;
