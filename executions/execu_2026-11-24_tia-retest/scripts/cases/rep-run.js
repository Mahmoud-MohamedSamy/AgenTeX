const RIDS = { test: '03d7cdc2', gold: 'b325b1ae' }; const all = arr((await api('GET', '/reporting/reports?limit=100')).j?.data); const o = {};
for (const [k, pre] of Object.entries(RIDS)) { const R = all.find(x => String(x.id).startsWith(pre)); const row = { name: R.name, keys: Object.keys(R).slice(0, 25) };
  for (const [m, p, b] of [['POST', `/reporting/reports/${R.id}/run`, {}], ['GET', `/reporting/reports/${R.id}/data`], ['POST', `/reporting/reports/${R.id}/execute`, {}], ['GET', `/reporting/reports/${R.id}/results`]]) { const r = await api(m, p, b); row[m + ' ' + p.split('/').pop()] = r.s + ' ' + (r.t || '').slice(0, 260); if (r.s === 200) break; }
  const t = await ask(`Run the report "${R.name}" and tell me the total number of rows and the main numbers it shows.`, { page: { app: 'crm' } }); row.tia = (t.text || t.final?.text || '').slice(0, 400); if (t.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${t.final.conversation_id}`);
  o[k] = row; }
return o;
