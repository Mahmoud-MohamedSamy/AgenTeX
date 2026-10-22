const me = await api('GET', '/iam/me');
await sleep(10000);
return done({ profiles: (me.j.data.profiles||[]).map(p => p.name), roles: me.j.data.roles, body: (await txt()).split('Storage Requests')[1], hub: (await api('GET','/settings/hub?app=crm')).t.slice(0,300) });
