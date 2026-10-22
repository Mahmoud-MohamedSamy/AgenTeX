const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const ids = ['85e8a4fc-0b1d-4070-b772-17dd703fd6d3', '9802a2ed-fcf5-4539-8869-1b7d0e254027', '0cee82f1-55ba-43b4-a54e-1f512709896a', '2a7b23bf-8bff-4014-a572-36e2e49a4233', '2e3666fe-3f70-427a-b2d8-0a4cee463a8c'];
const live = []; for (const id of ids) { const r = await api('GET', `/modules/${L}/records/${id}`); live.push(r.s + (r.j?.data?.is_deleted ? ' deleted' : '')); }
let items = [], cur = null;
for (let i = 0; i < 10; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); items.push(...arr(r.j?.data)); cur = r.j?.meta?.next_cursor; if (!cur) break; }
const mine = items.filter(x => /QA RT imp/.test(x.record_label || ''));
return done({ live, binTotal: items.length, mine: mine.map(x => JSON.stringify(x).slice(0, 400)) });
