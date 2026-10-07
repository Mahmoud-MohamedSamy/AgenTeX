let purged = 0, seen = 0, cursor = null, left = [];
for (let p = 0; p < 20; p++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=desk&limit=100${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`); const items = arr(r.j && r.j.data && (r.j.data.items || r.j.data)); seen += items.length;
  const qa = items.filter(i => /QA MF|qa_mf/.test(JSON.stringify(i))); if (qa.length) { const d = await api('POST', '/audit/recycle-bin/delete', { ids: qa.map(i => i.id) }); if (d.s < 300) purged += qa.length; else left.push(d.s + ' ' + d.t.slice(0, 100)); }
  cursor = r.j && r.j.meta && (r.j.meta.next_cursor || r.j.meta.nextCursor); if (!cursor) break; }
rec('CLEANUP.bin', left.length ? 'FAIL' : 'PASS', `scanned ${seen}, purged ${purged} QA items ${left.join(';')}`);
return done();
