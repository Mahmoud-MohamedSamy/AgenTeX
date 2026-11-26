const me = (await api('GET', '/iam/users/me')).j?.data; const st = await api('GET', `/agents/tia/status?app=${process.env.APP}`);
return { tenant: String(me?.tenant_id || me?.org_id || '').slice(-4), user: !!me?.user_id, tia: st.s === 200 ? st.j?.data?.available : 'HTTP ' + st.s + ' ' + (st.j?.error?.code || '') };
