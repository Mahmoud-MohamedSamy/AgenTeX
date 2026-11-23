const TK = L((await api('GET', '/modules')).j?.data).find(m => m.moduleKey === 'desk_tickets').id;
const b = await api('DELETE', `/modules/${TK}/blueprints/81e55aa2-af6b-44b3-a5be-17ac874f11b5`); log('tickets blueprint', E(b).slice(0, 300));
const left = []; let cur = ''; for (let i = 0; i < 40; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=desk&app_key=crm&limit=200${cur}`); for (const it of L(r.j?.data)) if (it.module_id === made.mod || it.module_id === made.child || /^(QA FX|qafx)/i.test(it.record_label || '')) left.push({ id: it.id, label: it.record_label, mod: it.module_id === made.mod ? 'QA FX Desk' : it.module_name || it.module_id }); const n = r.j?.meta?.next_cursor; if (!n) break; cur = '&cursor=' + encodeURIComponent(n); }
log('bin items left', left.length, JSON.stringify(left.slice(0, 10)));
if (left.length) { const p = await api('POST', '/audit/recycle-bin/delete', { ids: left.map(x => x.id).slice(0, 25) }); log('purge', E(p).slice(0, 300)); }
