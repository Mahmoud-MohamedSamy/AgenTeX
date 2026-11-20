const sts = [ST('Open', { position: { x: 0, y: 0 }, slaMinutes: 20, slaPreExpiryMinutes: 10 }), ST('On Hold', { position: { x: 300, y: 0 }, slaMinutes: 4320, slaPreExpiryMinutes: 120 }), ST('Escalated', { position: { x: 600, y: 0 }, slaMinutes: 90, slaPreExpiryMinutes: 60, autoTransitionId: 'a3', autoTransitionAfterMinutes: 1440 }),
 ST('Closed', { position: { x: 900, y: 0 }, slaMinutes: 2160, slaPreExpiryMinutes: 45 })];
const trs = [TR('a1', 'Open', 'On Hold'), TR('a2', 'On Hold', 'Escalated'), TR('a3', 'Escalated', 'Closed')];
const b = await mkBp(DEF('3063 units', sts, trs), false);
const d = (await getBp(b.id))?.definition; return { r: E(b.r), id: b.id, stored: (d?.states || []).map(s => [s.id, s.slaMinutes, s.slaPreExpiryMinutes, s.autoTransitionAfterMinutes]) };
