const o = {}; const g = await getBp('ff6ef3d5-76c4-4b03-891a-42940a4b1214'); o.bp = { rev: g.revision, active: g.isActive, name: g.definition.name };
const d = DEF('D3 3069 type', [ST('Open', { position: { x: 'abc', y: 0 } }), ST('Closed', { isTerminal: true })], [TR('x', 'Open', 'Closed')]);
const r = await api('POST', `/modules/${TK}/blueprints`, { definition: d, isActive: false }); if (r.j?.data?.id) { made.bps.push(r.j.data.id); keep(); LED('blueprint stored ' + r.j.data.id); }
o.posStr = { s: r.s, code: r.j?.error?.code, det: r.j?.error?.details };
const d2 = DEF('D3 3069 type2', [ST('Open'), ST('Closed', { isTerminal: 'yes' })], [TR('x', 'Open', 'Closed')]);
const r2 = await api('POST', `/modules/${TK}/blueprints`, { definition: d2, isActive: false }); if (r2.j?.data?.id) { made.bps.push(r2.j.data.id); keep(); LED('blueprint stored ' + r2.j.data.id); }
o.termStr = { s: r2.s, code: r2.j?.error?.code, det: r2.j?.error?.details };
o.count = L((await api('GET', `/modules/${TK}/blueprints`)).j?.data).filter(b => /QA BP RT19 D3/.test(b.definition?.name || '')).map(b => b.definition.name + '=' + (b.isActive ? 'ON' : 'off'));
return o;
