const me = await api('GET', '/iam/me'); out.me = me.s + ' ' + ((D(me.j)||{}).email||'').replace(/^(.{3}).*@/, '$1…@');
return fin({ out });
