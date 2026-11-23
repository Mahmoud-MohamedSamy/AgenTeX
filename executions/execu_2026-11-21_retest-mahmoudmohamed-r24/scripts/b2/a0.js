const me = await api('GET', '/iam/me'); const d = me.j?.data || {};
return { s: me.s, id: d.user_id || d.id || d.userId, name: d.display_name || d.displayName };
