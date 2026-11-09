const out = {}, ids = [];
for (const [k, M, L] of [['qa_w5_module (required pick list)', 'df656ed7-da62-4e06-b17b-bb3c83961fde', '98c36ff8-3621-411b-b373-14455f4df087'], ['qa_w5_noplural (Name required on layout)', 'bb375218-6a5d-48ec-a832-fb062fd0311b', '3a58c8a9-a334-4607-b4b3-c5129751f3ab'], ['contacts (Customers)', MODS.contacts, '92269f8a-040c-4b00-8d33-cc323391dc3b'], ['leads', MODS.leads, 'bf971461-2edc-45f2-b6e4-6e180aa64288']]) {
  const r = await call('POST', `/modules/${M}/records`, { layout_id: L, data: [] }); out[k] = r.s + ' ' + r.t.slice(0, 200); if (r.s < 300) { ids.push([M, r.j.data.id]); await call('DELETE', `/modules/${M}/records/${r.j.data.id}`); }
}
out.deletedBlank = ids; return out;
