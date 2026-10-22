const me = await api('GET', '/iam/me'); const ts = await api('GET', '/teamspaces');
return { id: me.j?.data?.user_id, profiles: (me.j?.data?.profiles || []).map(p => p.name), org: me.j?.data?.org_unit_id, ts: arr(ts.j?.data).map(t => t.name) };
