const o = as(OWNER);
const t = Date.now() % 100000;
const mk = async (n, extra = {}) => { const r = await o.post(`/modules/${MODS.leads}/records`, { layout_id: LAY.leads, data: enc({ first_name: n, phone: '0101' + String(1000000 + t).slice(0, 7), single_line_3_9: 'QA R2W2', ...extra }) }); return r.s < 300 ? r.j.data.id : 'ERR ' + r.t.slice(0, 200); };
const a = await mk('QA R2W2 MG A ' + t, { company: 'Alpha' }), b = await mk('QA R2W2 MG B ' + t, { company: 'Beta' });
out.ids = [a, b];
for (const body of [{}, { record_ids: [b] }, { merge_ids: [b] }, { duplicate_ids: [b] }, { source_record_ids: [b] }]) {
  const r = await o.post(`/modules/${MODS.leads}/records/${a}/merge`, body);
  out['merge ' + JSON.stringify(body)] = r.s + ' ' + r.t.slice(0, 300);
  if (r.s < 300) break;
}
out.locks = (await o.get(`/modules/${MODS.leads}/record-locks`)).t.slice(0, 400);
out.lockCreate = (await o.post(`/modules/${MODS.leads}/record-locks`, {})).t.slice(0, 400);
