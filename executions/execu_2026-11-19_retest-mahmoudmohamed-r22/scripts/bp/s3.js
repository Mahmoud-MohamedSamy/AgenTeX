const MM = '7e5e7c27-46e4-4bf6-b021-7bd219d34472'; const o = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8'));
const sts = () => [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 350, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 700, y: 0 } })];
const bad = await api('POST', `/modules/${TK}/blueprints`, { definition: DEF('3065 vo-owner-cs', sts(), [TR('vo', 'Open', 'Escalated', { before: { allowedUserIds: [MM] } }), TR('end', 'Escalated', 'Closed')]), isActive: false });
o.saveViewOnlyCS = E(bad); if (bad.j?.data?.id) { made.bps.push(bad.j.data.id); keep(); LED('blueprint created (UNEXPECTED) ' + bad.j.data.id + ' vo-owner-cs inactive'); }
const r = await api('GET', '/modules/' + TK + '/records/' + o.r1); o.recKeys = (r.j?.data?.data || []).map(x => x.field).filter(f => /number|no$/i.test(f));
o.recTop = Object.keys(r.j?.data || {});
fs.writeFileSync(RUN + '/scripts/bp/3065.json', JSON.stringify(o, null, 1)); return o;
