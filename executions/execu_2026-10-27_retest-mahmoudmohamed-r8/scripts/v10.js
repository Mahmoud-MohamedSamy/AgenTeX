const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', SE = '680e9a70-923c-4a8a-8d10-a2510950307f'; const out = {};
const pls = (await api('GET', `/modules/${D}/pipelines?layout_id=${SE}`)).j?.data; const pl = arr(pls); out.pipelines = pl.map(p => p.name + ' ' + p.id + ' ' + (p.stages || []).map(s => s.stageValue || s.value).slice(0, 3).join(','));
const enc = v => ({ kind: 'string', value: String(v) });
const p0 = pl.find(p => p.isDefault) || pl[0];
const r = await api('POST', `/modules/${D}/records`, { layout_id: SE, data: [['name', 'QA RT r8 deal SE'], ['deal_name', 'QA RT r8 deal SE'], ['pipeline', p0?.id], ['stage', (p0?.stages || [])[0]?.stageValue || 'qualification']].map(([f, v]) => ({ field: f, value: enc(v) })) });
out.create = r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 250)); out.id = r.j?.data?.id;
return done(out);
