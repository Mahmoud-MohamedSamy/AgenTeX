const r = await api('GET', '/desk/kb/articles?limit=50&search=QA%20TIA'); const r2 = await api('GET', '/desk/articles?limit=50');
const L = arr(r.j?.data).concat(arr(r2.j?.data)).filter(a => /QA TIA/.test(a.title || ''));
for (const a of L) ledger(`Desk KB draft "${a.title}" ${a.id} status ${a.status} by ${a.created_by_name || a.author_name || a.created_by}`);
return { s: [r.s, r2.s], found: L.map(a => ({ id: a.id, title: a.title, status: a.status, by: a.created_by_name || a.author_name || a.created_by, cat: a.category_name || a.category_id })) };
