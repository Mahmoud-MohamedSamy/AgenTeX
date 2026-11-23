// Cleanup (run once per app): node fx.js cleanup.js crm|desk. Re-runnable; 404 = already gone. Results -> out/cleanup-<app>.json + ledger.
const app = made.appKey || 'crm'; const res = []; const M = made.mod;
const del = async (what, p) => { const r = await api('DELETE', p); const ok = r.s < 300 || r.s === 404; res.push([what, r.s, ok ? '' : E(r).slice(0, 200)]); return r; };
const fieldId = async (m, n) => L((await api('GET', `/modules/${m}/fields`)).j?.data).find(f => f.fieldName === n)?.id;
const mods = L((await api('GET', '/modules')).j?.data); const modId = k => mods.find(m => m.moduleKey === k)?.id;
// 1. live modules
if (app === 'crm' && made.live) { for (const [m, id] of made.live.records) await del('live record ' + id, `/modules/${m}/records/${id}`); for (const [m, n] of made.live.fields) { const id = await fieldId(m, n); if (id) await del('live field ' + n, `/modules/${m}/fields/${id}`); } }
if (app === 'desk' && made.tickets) { const TK = modId('desk_tickets');
  for (const id of made.tickets.rules || []) await del('assignment rule ' + id, `/desk/assignment-rules/${id}`);
  for (const id of made.tickets.bps || []) await del('tickets blueprint ' + id, `/modules/${TK}/blueprints/${id}`);
  for (const id of made.tickets.tickets) await del('ticket ' + id, `/modules/${TK}/records/${id}`);
  for (const n of made.tickets.fields) { const id = await fieldId(TK, n); if (id) await del('tickets field ' + n, `/modules/${TK}/fields/${id}`); }
  const CO = modId('desk_contacts'); const cs = L((await api('GET', `/modules/${CO}/records?limit=50&q=${encodeURIComponent('qa.fx.webform@example.com')}`)).j?.data).filter(r => JSON.stringify(r.data).includes('qa.fx.webform@example.com'));
  for (const c of cs) await del('webform contact ' + c.id, `/modules/${CO}/records/${c.id}`); }
if (made.acc) await del('account ' + made.acc, `/modules/${modId(app === 'crm' ? 'accounts' : 'desk_accounts')}/records/${made.acc}`);
// 2. automation and settings on the test module
for (const id of made.wf || []) await del('workflow rule ' + id, `/workflow/rules/${id}`);
for (const id of made.bps || []) await del('blueprint ' + id, `/modules/${M}/blueprints/${id}`);
for (const id of made.views || []) await del('view ' + id, `/modules/${M}/views/${id}`);
for (const p of L((await api('GET', `/modules/${M}/field-permissions`)).j?.data)) await del('field permission ' + p.id, `/modules/${M}/field-permissions/${p.id}`);
// 3. records of the test modules (all records there are ours)
let deleted = 0; for (const m of [M, made.child].filter(Boolean)) for (let round = 0; round < 30; round++) {
  const ids = L((await api('GET', `/modules/${m}/records?limit=100`)).j?.data).map(r => r.id); if (!ids.length) break;
  const r = await api('DELETE', `/modules/${m}/records/bulk?ids=${ids.join(',')}`); if (r.s >= 300) { res.push(['bulk delete', r.s, E(r).slice(0, 200)]); break; } deleted += ids.length; await sleep(1500); }
res.push(['records deleted (bulk)', deleted, '']);
// 4. purge our items from the recycle bin
const mine = []; let cur = '';
for (let i = 0; i < 40; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=${app}&app_key=iam&app_key=workflow&app_key=mail&limit=200${cur}`); const items = L(r.j?.data);
  for (const it of items) if ([M, made.child, modId('desk_tickets'), modId('leads'), modId('contacts'), modId('accounts'), modId('desk_accounts'), modId('desk_contacts')].includes(it.module_id) && (it.module_id === M || it.module_id === made.child || /^(QA FX|qafx)/i.test(it.record_label || '') || (made.tickets?.tickets || []).includes(it.record_id) || [made.acc, ...(made.live?.records || []).map(x => x[1])].includes(it.record_id))) mine.push(it.id);
  const n = r.j?.meta?.next_cursor; if (!n) break; cur = '&cursor=' + encodeURIComponent(n); }
let purged = 0; for (let i = 0; i < mine.length; i += 25) { const r = await api('POST', '/audit/recycle-bin/delete', { ids: mine.slice(i, i + 25) }); if (r.s < 300) purged += Math.min(25, mine.length - i); else res.push(['bin purge', r.s, E(r).slice(0, 200)]); }
res.push(['bin items purged', purged + '/' + mine.length, '']);
// 5. layouts B and the modules
for (const m of [made.child, M].filter(Boolean)) await del('module ' + m, `/modules/${m}?cascade=true`);
fs.writeFileSync(RUN + '/out/cleanup-' + app + '.json', JSON.stringify(res, null, 1)); led(app + ' cleanup: ' + res.filter(x => x[2]).length + ' problems');
for (const r of res) log(r.join(' | '));
