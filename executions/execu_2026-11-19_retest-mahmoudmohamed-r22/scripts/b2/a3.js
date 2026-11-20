const J = JSON.parse(fs.readFileSync(RUN + '/scripts/b2/3065.json', 'utf8')); const o = {};
const full = r => r.s + ' ' + (r.j?.error?.code || '') + ' "' + String(r.j?.error?.message || '').slice(0, 120) + '"';
for (const k of ['V1', 'V2']) { const t = await api('GET', '/desk/tickets/' + J.t[k]); o[k] = J.n[k] + ' open=' + t.s + ' access=' + (t.j?.data?.access || t.j?.data?.viewer_access || '-') + ' trans=' + JSON.stringify(await trans(J.t[k]));
  for (const tr of ['onlyA', 'shared']) { const r = await runT(J.t[k], tr); o[k + '_' + tr] = full(r); LED('as CES2 (view-only) API run ' + tr + ' on ' + J.n[k] + ': ' + r.s); }
  o[k + '_after'] = (await api('GET', '/desk/tickets/' + J.t[k])).j?.data?.status; }
return o;
