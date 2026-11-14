// Evidence for the 4 missing functions (Z7, Z10 reply part, Z11, Z12). node zm-prep.js prep | clean  (ids in zm-prep.json)
const n = require('./bp/ndc'); const { call, CS } = n; const fs = require('fs');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const OUT = __dirname + '/zm-prep.json';
const tr = (id, a, b) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during: {}, after: { actions: [] } });
(async () => {
  const mode = process.argv[2];
  if (mode === 'prep') {
    const d = { name: 'QA BP ZM missing', description: 'QA evidence for missing functions - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS,
      entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ZM never ' },
      states: [ { id: 'Open', name: 'Open', position: { x: 0, y: 0 }, slaClock: 'business', slaMinutes: 120, slaPreExpiryMinutes: 60, onReplyTransitionId: 'go', onRatingTransitionId: 'end', onRatingValues: ['good'] },
        { id: 'On Hold', name: 'On Hold', position: { x: 300, y: 0 }, slaClock: 'calendar' }, { id: 'Closed', name: 'Closed', position: { x: 600, y: 0 }, slaClock: 'calendar', isTerminal: true } ],
      transitions: [tr('go', 'Open', 'On Hold'), tr('end', 'Open', 'Closed'), tr('fin', 'On Hold', 'Closed')] };
    const r = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: d, isActive: false });
    const M = { B: r.json?.data?.id, res: r.status + ' ' + (r.msg || '') };
    const g = await call('owner', 'GET', `/modules/${TK}/blueprints/${M.B}`); M.open = JSON.stringify(g.json?.data?.definition?.states?.[0]);
    fs.writeFileSync(OUT, JSON.stringify(M, null, 1)); console.log(JSON.stringify(M)); return;
  }
  if (mode === 'clean') { const M = JSON.parse(fs.readFileSync(OUT, 'utf8')); const r = await call('owner', 'DELETE', `/modules/${TK}/blueprints/${M.B}`);
    const l = await call('owner', 'GET', `/modules/${TK}/blueprints`); const left = (l.json?.data || []).filter(b => /^QA BP ZM/.test(b.name || b.definition?.name || '')).length;
    console.log('delete', r.status, 'QA BP ZM left', left); }
})();
