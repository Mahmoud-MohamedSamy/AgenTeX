const o = {}; const CT = '43004ce2-577f-4eda-b00a-0750fe40c3d4', AC = '784400e1-4a2a-42c2-b4f3-7ca56e79828a', TK = 'd120a6c2-2596-4254-968b-a1bcd3a000bf', CL = 'f7e488b5-0232-42fd-811c-1f24356af653';
const find = async (m, field) => arr((await api('GET', `/modules/${m}/records?page=1&per_page=20&filters=${encodeURIComponent(JSON.stringify([{ field, operator: 'starts_with', value: 'QA TIA CRUD' }]))}`)).j?.data).map(x => x.id);
o.contacts = await find(CT, 'last_name'); o.accounts = await find(AC, 'Account_Name'); if (!o.accounts.length) o.accounts = await find(AC, 'account_name');
o.tasks = await find(TK, 'subject'); o.calls = await find(CL, 'subject');
for (const p of ['/desk/kb/sections', '/desk/kb/categories', '/desk/kb/category-groups']) { const r = await api('GET', p + '?limit=200'); o[p] = r.s + ' ' + (r.s === 200 ? arr(r.j?.data).filter(x => JSON.stringify(x).includes('QA TIA CRUD')).map(x => x.id + ':' + (x.name || x.title)).join(',') : ''); }
const art = arr((await api('GET', '/desk/kb/articles?limit=200')).j?.data).filter(x => JSON.stringify(x).includes('QA TIA CRUD')); o.articles = art.map(x => x.id + ':' + (x.title || x.name) + ':' + (x.status || ''));
if (process.env.DEL) {
  o.del = {};
  for (const id of o.contacts) o.del['c' + id] = (await api('DELETE', `/modules/${CT}/records/${id}`)).s;
  for (const id of o.accounts) o.del['a' + id] = (await api('DELETE', `/modules/${AC}/records/${id}`)).s;
  for (const x of art) o.del['art' + x.id] = (await api('DELETE', `/desk/kb/articles/${x.id}`)).s;
  for (const p of ['/desk/kb/sections', '/desk/kb/categories']) { const s = o[p] || ''; for (const id of (s.split(' ')[1] || '').split(',').filter(Boolean).map(v => v.split(':')[0])) o.del[p + '/' + id] = (await api('DELETE', `${p}/${id}`)).s; }
  ledger('CRUD2 cleanup Desk: ' + JSON.stringify(o.del));
}
return o;
