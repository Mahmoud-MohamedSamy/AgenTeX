const f = arr((await api('o', 'GET', '/timeline/records/leads/90af29c4-1995-494a-bd39-7974f200b91e/feed')).j?.data);
return { keys: Object.keys(f[0] || {}), entries: f.reverse().map(e => JSON.stringify(e).replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 600)) };
