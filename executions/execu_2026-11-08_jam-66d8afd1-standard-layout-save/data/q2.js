const MID = '88e8ea44-1658-4df3-9930-d0902b91073d';
const sig = v => v && v.layout ? JSON.stringify((v.layout.sections || []).map(s => (s.columns || []).map(c => (c.fields || []).map(f => f.apiName)))) : null;
const secs = v => v && v.layout ? (v.layout.sections || []).map(s => (s.label && (s.label.en || s.label.default)) || s.id) : null;
const out = [];
for (const x of arr((await api('GET', `/modules/${MID}/layouts`)).j.data)) {
  const d = (await api('GET', `/modules/${MID}/layouts/${x.id}`)).j.data;
  const C = d.views.CREATE, D = d.views.DETAIL;
  const dn = D && D.layout ? (D.layout.sections || []).flatMap(s => s.columns.flatMap(c => c.fields.map(f => f.apiName))) : [];
  out.push({ name: x.name, rowVersion: d.rowVersion, lastModified: d.lastModifiedAt, detailEqualsCreate: sig(C) === sig(D), detailSections: secs(D), detailHasIntegrationFields: dn.includes('crm_deal_id') || dn.includes('contract_id'), detailUpdatedAt: D && D.updatedAt, createUpdatedAt: C && C.updatedAt });
}
return out;
