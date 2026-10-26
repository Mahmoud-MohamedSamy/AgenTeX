const me = await api('GET', '/iam/me'); return { id: me.j?.data?.id || me.j?.data?.user_id };
