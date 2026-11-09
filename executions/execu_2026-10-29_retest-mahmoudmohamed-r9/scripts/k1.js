// 2322: 24 / 25 / 26 leaf conditions in one And group (rules inactive, deleted right after).
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const leaf = i => ({ kind: 'StringMatch', field: 'first_name', operator: 'Contains', stringValue: 'QA RT 2322 c' + i, caseInsensitive: false });
for (const n of [24, 25, 26]) { const r = await api('POST', '/workflow/rules', { moduleId: L, name: 'QA RT 2322 ' + n, isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: { kind: 'Logical', operator: 'And', operands: Array.from({ length: n }, (_, i) => leaf(i)) }, actions: [{ order: 0, type: 'FieldUpdate', fieldUpdates: { description: { kind: 'string', stringValue: 'x' } } }] });
  out[n] = r.s + ' ' + (r.s >= 300 ? (r.j?.error?.message || r.t).slice(0, 160) : 'saved'); if (r.j?.data?.id) await api('DELETE', `/workflow/rules/${r.j.data.id}`); }
// 2382: pipeline field on Deals now
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const f = arr((await api('GET', `/modules/${D}/fields`)).j?.data).find(x => /pipeline/.test(x.apiName || ''));
out.pipelineField = f ? { api: f.apiName, type: f.datatypeKey, allowed: JSON.stringify(f.datatypeOptions || {}).slice(0, 300), modified: f.lastModifiedAt + ' ' + f.lastModifiedByName } : 'none';
out.pipelines = arr((await api('GET', `/modules/${D}/pipelines?layout_id=fcba0068-d67f-44f5-8412-cdef9c09e16e`)).j?.data).map(p => p.id.slice(0, 8) + ' ' + p.name + (p.isDefault || p.is_default ? ' (default)' : ''));
return done(out);
