const fs = require('fs');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const call = async p => { const r = await fetch(BASE + p, { headers: { 'x-api-key': KEY } }); return r.json(); };
(async () => {
  const id = process.argv[2]; const w = await call('/work-items/' + id + '/?expand=state');
  console.log('NAME', w.name, '| state', w.state && (w.state.name || w.state), '| prio', w.priority, '| updated', w.updated_at);
  console.log('DESC', (w.description_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 3000));
  const c = await call('/work-items/' + id + '/comments/'); for (const x of (c.results || [])) console.log('COMMENT', x.created_at, (x.comment_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 800));
})().catch(e => console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')));
