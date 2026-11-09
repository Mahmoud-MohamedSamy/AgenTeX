const id = '766590c6-59f8-432c-ae22-c74d77b3bb7a';
return done({ list: arr((await api('GET', '/teamspaces')).j?.data).some(t => t.id === id), open: (await api('GET', `/teamspaces/${id}`)).s, folders: (await api('GET', `/teamspaces/${id}/folders`)).s });
