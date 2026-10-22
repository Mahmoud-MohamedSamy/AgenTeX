const id = '6efdaee1-c891-4b6e-bc97-8db54f607138';
return done({ list: arr((await api('GET', '/teamspaces')).j.data).map(t => t.name), one: (await api('GET', `/teamspaces/${id}`)).s });
