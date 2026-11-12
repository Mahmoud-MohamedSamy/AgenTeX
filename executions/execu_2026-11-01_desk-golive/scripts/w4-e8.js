const TK = '6f9037a0-15b3-4f21-a584-2e21b3b5259e';
const orig = D((await api('GET', '/desk/happiness/settings')).j); out.orig = orig;
const on = { ...orig, is_enabled: true, department_scope_enabled: true, department_ids: ['2a73bbc0-efb3-4250-bf9b-2fdc98236794'] };
const p = await api('PUT', '/desk/happiness/settings', on); out.put = p.s + ' ' + JSON.stringify(p.j && p.j.error || '').slice(0, 200);
out.now = JSON.stringify(D((await api('GET', '/desk/happiness/settings')).j)).slice(0, 250);
if (p.s < 300) {
  for (const path of ['/reopen', '/open']) { const r = await api('POST', '/desk/tickets/' + TK + path, {}); out['re' + path] = r.s; if (r.s < 300) break; }
  await sleep(3000);
  const c = await api('POST', '/desk/tickets/' + TK + '/close', {}); out.close = c.s + ' ' + JSON.stringify(D(c.j) && D(c.j).status);
  await sleep(8000);
}
const back = await api('PUT', '/desk/happiness/settings', orig); out.back = back.s;
const fin2 = D((await api('GET', '/desk/happiness/settings')).j); out.restored = fin2.is_enabled === orig.is_enabled && fin2.department_scope_enabled === orig.department_scope_enabled && JSON.stringify(fin2.department_ids) === JSON.stringify(orig.department_ids);
return fin({ out });
