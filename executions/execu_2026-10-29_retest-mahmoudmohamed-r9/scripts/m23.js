const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
for (const id of ['2a2f3f4a-c2f0-4e5f-a0be-8bc40b475850', 'bba3bc66-1d83-4314-a086-34fd4f13bcae']) { const g = await api('GET', `/modules/${L}/records/${id}`); const o = {}; for (const d of g.j?.data?.data || []) o[d.field] = d.value && d.value.value !== undefined ? d.value.value : d.value; out[id.slice(0, 8)] = { s: g.s, owner: o.owner, modified: o.modified_at || g.j?.data?.updated_at, created: o.created_at || g.j?.data?.created_at };
  out[id.slice(0, 8)].timeline = arr((await api('GET', `/timeline/records/leads/${id}/feed`)).j?.data).map(e => e.entry_type + ' ' + (e.occurred_at || '').slice(11, 23) + ' ' + JSON.stringify(e.changes || e.payload || '').slice(0, 120)).slice(0, 6); }
return done(out);
