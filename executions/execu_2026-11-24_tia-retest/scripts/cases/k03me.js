const me = (await api('GET', '/iam/me')).j?.data; return me.id || me.user_id;
