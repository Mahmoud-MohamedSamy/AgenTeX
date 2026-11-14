const long = ('QA BP B10L ' + 'Long name truncation check '.repeat(4)).slice(0, 60);
const a = await mkBp({ ...BASIC('B10L'), name: long }); log('long60', E(a.r), long.length);
const l61 = await api('POST', `/modules/${TK}/blueprints`, { definition: { ...BASIC('B10M'), name: long + 'x' }, isActive: false }); log('61', E(l61)); if (l61.j?.data?.id) { made.bps.push(l61.j.data.id); keep(); }
const x = await mkBp({ ...BASIC('B10X'), name: "QA BP B10X عربي مختلط 😀 ' OR 1=1--" }, false); log('arabic inactive', E(x.r));
const d2 = { ...BASIC('B10L'), name: long, description: 'draft change', states: [ST('Open'), ST('Escalated'), ST('On Hold'), ST('Closed', { isTerminal: true })] };
const dr = await api('PUT', `/modules/${TK}/blueprints/${a.id}/draft`, { definition: d2 }); log('draft', E(dr));
const all = L((await api('GET', `/modules/${TK}/blueprints?includeInactive=true`)).j?.data).filter(b => b.department_id === CS).map(b => ({ n: b.definition?.name, act: b.isActive, st: (b.definition?.states||[]).length, draft: b.hasDraft, inprog: b.in_progress_count, upd: b.updatedAt }));
log(JSON.stringify(all));
