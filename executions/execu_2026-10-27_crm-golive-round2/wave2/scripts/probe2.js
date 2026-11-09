const o = as(OWNER);
const [a, b] = ['10ba77fe-deae-45ba-b617-118e07b6ea05', 'e8cbf0da-ad12-4972-9230-b2c10eeb4171'];
const ga = await o.get(`/modules/${MODS.leads}/records/${a}`); out.masterCompany = val(ga.j, 'company'); out.masterName = val(ga.j, 'first_name');
out.dupGet = (await o.get(`/modules/${MODS.leads}/records/${b}`)).s;
const tl = await o.get(`/timeline/records/leads/${a}/feed`); out.timeline = (tl.j && tl.j.data && tl.j.data.data || []).map(e => e.entry_type).slice(0, 10);
const bodies = [
  { name: 'QA R2W2 lock', condition: { pattern: '1', conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA R2W2 LK' }] } },
  { name: 'QA R2W2 lock', condition: { kind: 'StringMatch', field: 'first_name', operator: 'StartsWith', stringValue: 'QA R2W2 LK' } },
  { name: 'QA R2W2 lock', condition: 'first_name starts_with QA R2W2 LK' }];
for (const body of bodies) { const r = await o.post(`/modules/${MODS.leads}/record-locks`, body); out['lock ' + JSON.stringify(body.condition).slice(0, 60)] = r.s + ' ' + r.t.slice(0, 350); if (r.s < 300) { out.lockId = r.j.data.id; break; } }
