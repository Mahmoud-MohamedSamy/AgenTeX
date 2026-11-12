const TK = '6f9037a0-15b3-4f21-a584-2e21b3b5259e';
const cur = D((await api('GET', '/desk/happiness/settings')).j); const orig = { ...cur };
out.before = { on: cur.is_enabled, scope: cur.department_scope_enabled, deps: cur.department_ids.length };
const p = await api('PUT', '/desk/happiness/settings', { ...cur, is_enabled: true, department_scope_enabled: true, department_ids: ['2a73bbc0-efb3-4250-bf9b-2fdc98236794'] }, { 'if-match': String(cur.row_version) }); out.on = p.s;
out.reopen = (await api('POST', '/desk/tickets/' + TK + '/reopen', {})).s; await sleep(3000);
const c = await api('POST', '/desk/tickets/' + TK + '/close', {}); out.close = c.s; out.closedAt = new Date().toISOString();
for (const pth of ['/desk/happiness/ratings?ticket_id=' + TK, '/desk/happiness/surveys?ticket_id=' + TK, '/desk/tickets/' + TK + '/happiness', '/desk/tickets/' + TK + '/rating', '/desk/happiness/ratings?limit=5', '/desk/happiness/responses?limit=5']) { const r = await api('GET', pth); out[pth.split('?')[0].split('/').slice(-2).join('/') + (pth.includes('ticket_id') ? '?t' : '')] = r.s + ' ' + JSON.stringify(D(r.j)).slice(0, 250); }
await sleep(120000);
const now = D((await api('GET', '/desk/happiness/settings')).j);
const b = await api('PUT', '/desk/happiness/settings', { ...orig, row_version: now.row_version }, { 'if-match': String(now.row_version) }); out.back = b.s;
const f = D((await api('GET', '/desk/happiness/settings')).j); out.restored = f.is_enabled === orig.is_enabled && f.department_scope_enabled === orig.department_scope_enabled && JSON.stringify(f.department_ids) === JSON.stringify(orig.department_ids);
return fin({ out });
