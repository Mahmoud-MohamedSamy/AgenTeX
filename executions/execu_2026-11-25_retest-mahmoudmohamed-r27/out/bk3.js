const o = {};
const c = await api.O('POST', '/desk/data/sandboxes', { name: 'QA RT27 restore 2863', source: { kind: 'backup', backup_id: ST.BK } });
o.create = E(c) + ' ' + c.t.slice(0, 700); const id = c.j?.data?.id; ST.SB = id; saveState(); if (id) ledger('sandbox ' + id);
if (!id) return o;
const t0 = Date.now(); o.timeline = [];
for (let i = 0; i < 90; i++) { const g = (await api.O('GET', '/desk/data/sandboxes/' + id)).j?.data; const line = `${Math.round((Date.now() - t0) / 1000)}s ${g?.status} ${JSON.stringify(g?.step || g?.phase || g?.progress || '')}`; if (o.timeline[o.timeline.length - 1]?.split(' ').slice(1).join(' ') !== line.split(' ').slice(1).join(' ')) o.timeline.push(line);
  if (/ready|active|failed|error/i.test(g?.status)) { o.final = JSON.stringify(g).slice(0, 1500); break; } await sleep(10000); }
return o;
