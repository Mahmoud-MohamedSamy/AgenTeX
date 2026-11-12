const me = await api('GET', '/iam/me'); const d = me.j && me.j.data || {};
return { s: me.s, keys: Object.keys(d), prof: JSON.stringify(d.profile || d.profiles || d.profileId || d.profile_id || d.roles || '').slice(0, 300) };
