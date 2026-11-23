const M = made.mod; const recs = L((await api('GET', `/modules/${M}/records?limit=5&sort_by=created_at&sort_dir=desc`)).j?.data);
for (const r of recs.slice(0, 3)) { const v = flat(r.data); log(v.name, 'fx_k4=', v.fx_k4 === undefined ? '(absent)' : v.fx_k4); }
const f = L((await api('GET', `/modules/${M}/fields`)).j?.data).find(x => x.fieldName === 'fx_k4');
const p = await api('PUT', `/modules/${M}/fields/${f.id}`, { ...f, labels: { en: 'QA FX K4 renamed' } }); log('save broken formula again', E(p));
