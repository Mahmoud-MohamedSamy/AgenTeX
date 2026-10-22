const id = '6efdaee1-c891-4b6e-bc97-8db54f607138';
const me = await api('GET', '/iam/me');
return { who: me.j?.data?.email, list: arr((await api('GET', '/teamspaces')).j?.data).map(t => t.name), one: (await api('GET', `/teamspaces/${id}`)).s, folders: (await api('GET', `/teamspaces/${id}/folders`)).s };
