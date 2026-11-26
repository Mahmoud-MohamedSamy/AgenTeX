const V = JSON.parse(fs.readFileSync(RUN + '/out/vis.json', 'utf8')); const r = await api('GET', `/modules/${M.leads}/records/${V.mine[0]}`); const d = arr(r.j?.data?.data);
const n = await api('GET', '/notifications?limit=3'); return { owner: JSON.stringify(d.find(x => x.field === 'owner')), notif: { s: n.s, sample: JSON.stringify(n.j?.data).slice(0, 500) } };
