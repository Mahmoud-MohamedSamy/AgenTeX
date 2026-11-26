const me = (await api('GET', '/iam/me')).j?.data; const st = (await api('GET', '/agents/tia/status')).j?.data; return { id: me.id || me.user_id, status: me.status, tia: st?.available };
