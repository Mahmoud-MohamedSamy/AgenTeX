const r = await api('POST', '/iam/users/' + US.C + '/overrides?app_key=desk', { permission_key: 'desk:ticket:share', effect: 'GRANT', reason: 'QA AC access run, remove after' }); out.grant = r.s + ' ' + r.t.slice(0, 200);
out.list = (await api('GET', '/iam/users/' + US.C + '/overrides?app_key=desk')).t.slice(0, 300);
return fin({ out });
