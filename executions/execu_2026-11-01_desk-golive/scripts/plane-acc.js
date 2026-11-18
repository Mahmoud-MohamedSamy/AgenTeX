// Read-only: search Plane for ticket-access related work items (17 Nov access run).
const fs = require('fs');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const W = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy', P = W + '/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const get = async u => (await fetch(u, { headers: { 'x-api-key': KEY } })).json();
(async () => {
  const st = {}; (await get(P + '/states/')).results.forEach(s => st[s.id] = s.name);
  const seen = {};
  for (const q of ['share', 'shared', 'move', 'department', 'access', 'visib', 'team', 'private', 'data sharing', 'role', 'profile', 'permission', 'hierarchy', 'unassigned', 'light agent', 'see tickets']) {
    const r = await get(W + '/work-items/search/?search=' + encodeURIComponent(q)).catch(() => ({}));
    for (const x of (r.issues || [])) { if (x.project__identifier && x.project__identifier !== 'NDC') continue; seen[x.sequence_id] = seen[x.sequence_id] || { n: x.name, q: [] }; seen[x.sequence_id].q.push(q); }
  }
  const ids = Object.keys(seen);
  for (const s of ids) { const d = await get(P + '/work-items/?per_page=1&sequence_id=' + s).catch(() => null); }
  // fetch states by identifier
  for (const s of ids) { const d = await get(W + '/work-items/NDC-' + s + '/').catch(() => ({})); seen[s].st = st[d.state] || '?'; seen[s].mod = d.module_ids ? d.module_ids.length : ''; }
  ids.sort((a, b) => a - b).forEach(s => console.log('NDC-' + s, '|', seen[s].st, '|', seen[s].n.slice(0, 120)));
})().catch(e => console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')));
