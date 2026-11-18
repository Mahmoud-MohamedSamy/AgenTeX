const fs = require('fs');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const W = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy';
(async () => { for (const q of ['light agent', 'follower', 'followers', 'records.views', 'raw key', 'move department', 'moved this ticket', 'moved ticket', 'ticket access', 'per agent', 'list move', 'Agent Personal', 'own tickets']) {
  const r = await (await fetch(W + '/work-items/search/?search=' + encodeURIComponent(q), { headers: { 'x-api-key': KEY } })).json().catch(() => ({}));
  console.log('##', q, '→', (r.issues || []).filter(x => !x.project__identifier || x.project__identifier === 'NDC').slice(0, 8).map(x => 'NDC-' + x.sequence_id + ' ' + x.name.slice(0, 90)).join(' || ')); } })().catch(e => console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')));
