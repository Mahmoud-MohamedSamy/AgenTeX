const M = made.mod; const fl = L((await api('GET', `/modules/${M}/fields`)).j?.data).filter(f => /^fx_(days|hours)between_/.test(f.fieldName));
const st = {}; for (const f of fl) { const e = f.datatypeOptions?.expression || ''; if (/^round\(/.test(e)) { st.skip = (st.skip || 0) + 1; continue; }
  const r = await api('PUT', `/modules/${M}/fields/${f.id}`, { ...f, datatypeOptions: { ...f.datatypeOptions, expression: `round(${e})` } }); st[r.s] = (st[r.s] || 0) + 1; if (r.s >= 300) log(f.fieldName, E(r).slice(0, 200)); }
log('fields', fl.length, st); led('CRM QA FX Matrix: daysbetween/hoursbetween wrapped in round() ' + JSON.stringify(st));
// re-save both records so stored values recalculate (existing records do not recalc on formula edit, NDC-3219)
for (const [id, nm] of [[made.recFull, 'QA FX Matrix - all filled'], [made.recEmpty, 'QA FX Matrix - all empty']]) log('resave', E(await api('PATCH', `/modules/${M}/records/${id}`, { data: data({ name: nm }) })).slice(0, 200));
await sleep(2000); const v = await getRec(M, made.recFull);
log(Object.fromEntries(Object.entries(v).filter(([k, x]) => /between_(date|date_time|subform)$/.test(k))));
const after = L((await api('GET', `/modules/${M}/fields`)).j?.data).filter(f => /^fx_(days|hours)between_date/.test(f.fieldName)).map(f => f.fieldName + ' = ' + f.datatypeOptions.expression); log(after);
