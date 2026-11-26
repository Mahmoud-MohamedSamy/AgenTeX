const a = arr((await api('GET', '/agents/tia-setup-areas')).j?.data);
return a.filter(x => /Canned replies|Snippets|Holiday lists/.test(x.title));
