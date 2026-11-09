const r = await api('o', 'GET', '/teamspaces'); return arr(r.j?.data).map(t => [t.id, t.name || t.labels?.en, t.appKey || t.app_key, (t.modules || t.moduleIds || []).length]);
