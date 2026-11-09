const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', LT = 'fcba0068-d67f-44f5-8412-cdef9c09e16e'; const out = {}; const ids = [];
const s = v => ({ kind: 'string', value: v });
const mk = async (label, pipe) => { const r = await api('POST', `/modules/${D}/records`, { layout_id: LT, data: [{ field: 'deal_name', value: s('QA RT 2382 ' + label) }, ...(pipe ? [{ field: 'pipeline', value: s(pipe) }] : [])] }); if (r.j?.data?.id) ids.push(r.j.data.id); out[label] = r.s + ' ' + (r.s >= 300 ? (r.j?.error?.message || r.t).slice(0, 200) : r.j.data.id); };
await mk('no pipeline'); await mk('pipeline 1 id', '640e03a4' + (await api('GET', `/modules/${D}/pipelines?layout_id=${LT}`)).j?.data?.find?.(p => p.name === '1')?.id?.slice(8));
await mk('Standard label', 'Standard (Standard)');
for (const id of ids) { const g = (await api('GET', `/modules/${D}/records/${id}`)).j?.data; out['read ' + id.slice(0, 8)] = JSON.stringify((g?.data || []).filter(x => /pipeline|stage/.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value?.value))); }
out.ids = ids;
return done(out);
