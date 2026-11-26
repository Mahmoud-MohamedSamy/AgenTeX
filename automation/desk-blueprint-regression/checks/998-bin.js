let purged = 0;
for (let i = 0; i < 10; i++) {
  let items = [], cursor = null;
  for (let p = 0; p < 20; p++) { const r = await api('GET', '/audit/recycle-bin/items?limit=100' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); items.push(...arr(r.j?.data)); cursor = r.j?.meta?.next_cursor || r.j?.meta?.cursor; if (!cursor) break; }
  const qa = items.filter(x => /QA BP R |QA BP Reg|QA BP echo|QA BP Verify|QA BP Done/.test(JS(x)));
  if (!qa.length) break; const r = await api('POST', '/audit/recycle-bin/delete', { ids: qa.map(x => x.id) }); purged += qa.length; log('purge', qa.length, r.s); await sleep(4000);
}
const ca = MADE.other.find(x => x.kind === 'ca_action'), src = MADE.other.find(x => x.kind === 'ca_source');
const d1 = await api('DELETE', `/workflow/custom-actions/${ca.id}`); await sleep(1500); const d2 = await api('DELETE', `/workflow/custom-actions/sources/${src.id}`);
const left = arr((await api('GET', '/workflow/custom-actions')).j?.data).filter(x => /QA BP/.test(x.name || '')).length;
const deps = arr((await api('GET', '/desk/departments')).j?.data).filter(d => /QA BP Reg/.test(d.name)).length;
const sts = ((await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []).filter(s => /QA BP/.test(s.value)).length;
return { purged, caDelete: E(d1), sourceDelete: E(d2), qaCustomActionsLeft: left, qaDeptLeft: deps, qaStatusesLeft: sts };
