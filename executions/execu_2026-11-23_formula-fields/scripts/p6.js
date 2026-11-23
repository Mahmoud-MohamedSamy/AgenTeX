const M = made.mod; const fl = L((await api('GET', `/modules/${M}/fields`)).j?.data).filter(f => f.datatypeKey === 'formula' && !/^fx_/.test(f.fieldName));
log(fl.map(f => ({ name: f.fieldName, label: f.labels, opts: f.datatypeOptions, cfg: f.config })));
