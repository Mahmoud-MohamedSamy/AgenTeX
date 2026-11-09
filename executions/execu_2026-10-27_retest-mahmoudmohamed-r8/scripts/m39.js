const out = {}; const M = 'b97a713b-1da4-4a14-a100-490575c7367f';
out.delModule = (await api('DELETE', `/modules/${M}`)).t.slice(0, 300);
let c = '', orphans = []; for (let i = 0; i < 15; i++) { const b = await api('GET', `/audit/recycle-bin/items?app_key=crm&limit=200${c ? '&cursor=' + encodeURIComponent(c) : ''}`); const a = arr(b.j?.data); orphans.push(...a.filter(x => /^qa_w5_auto/.test(x.module_key || '')).map(x => ({ id: x.id, label: x.record_label, module: x.module_key, by: x.deleted_by_label, at: x.deleted_at }))); c = b.j?.meta?.next_cursor; if (!c || !a.length) break; }
out.qaW5Orphans = orphans.length; out.sample = orphans.slice(0, 3);
return done(out);
