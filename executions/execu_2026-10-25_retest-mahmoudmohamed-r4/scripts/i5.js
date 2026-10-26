const f = await api('GET', '/desk/integrations/crm/failures?limit=50'); const a = arr(f.j?.data);
return done({ s: f.s, n: a.length, items: a.slice(0, 8).map(x => ({ at: x.updated_at || x.created_at, kind: x.kind || x.module, err: (x.last_error || x.reason || '').slice(0, 260) })) });
