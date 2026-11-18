const sts = [ST('Open', { position: { x: 0, y: 0 }, slaMinutes: 20, slaPreExpiryMinutes: 10 }), ST('On Hold', { position: { x: 300, y: 0 }, slaMinutes: 4320, slaPreExpiryMinutes: 120 }), ST('Escalated', { position: { x: 600, y: 0 }, slaMinutes: 90, slaPreExpiryMinutes: 60 }),
 ST('Closed', { isTerminal: true, position: { x: 900, y: 0 } })];
const trs = [TR('a1', 'Open', 'On Hold'), TR('a2', 'On Hold', 'Escalated'), TR('a3', 'Escalated', 'Closed')];
const b = await mkBp(DEF('F09 units', sts, trs), false);
const g = await getBp(b.id); const d = g?.definition; const o = { r: E(b.r), id: b.id, active: g?.isActive, stored: (d?.states || []).map(s => [s.id, s.slaMinutes, s.slaPreExpiryMinutes]) };
fs.writeFileSync(RUN + '/scripts/bp/f09.json', JSON.stringify(o, null, 1)); return o;
