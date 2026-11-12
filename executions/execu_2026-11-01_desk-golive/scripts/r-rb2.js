const rb = await api('GET', '/audit/recycle-bin/items?limit=25');
return done(arr(rb.j && rb.j.data).map(x => [x.id.slice(0, 8), x.module_key, x.record_label, x.deleted_by_label, x.deleted_at.slice(5, 19)]));
