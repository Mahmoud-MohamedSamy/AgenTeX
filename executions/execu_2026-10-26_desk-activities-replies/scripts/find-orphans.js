// List AG's tasks created today whose subject is only x's (bisect leftovers without the QA prefix) and add them to CREATED for cleanup
const L = await api('GET', `/modules/${M.tasks}/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc`);
const list = ((L.j && L.j.data && (L.j.data.records || L.j.data.items || L.j.data)) || []).map(fl);
const orph = list.filter(x => /^x+$/.test(x.subject || '') || /^QA ACT/.test(x.subject || ''));
for (const o of orph) CREATED.push({ k: 'tasks', id: o.id, tag: /^x+$/.test(o.subject) ? 'orphan-x' : 'qa-found' });
return fin({ n: orph.length, x: orph.filter(o => /^x+$/.test(o.subject)).length });
