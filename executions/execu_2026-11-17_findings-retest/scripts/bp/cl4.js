const bin = await api('GET', '/audit/recycle-bin/items?app_key=desk&q=QA%20RT21%20BP&limit=100');
return L(bin.j?.data).filter(x => /QA RT21 BP/.test(JSON.stringify(x))).map(x => ({ id: x.id, rid: (x.record_id || x.entity_id || ''), t: x.entity_type || x.type || x.module_key, n: x.name || x.label || x.title || x.display_name, at: x.deleted_at, keys: Object.keys(x).join(',') }));
