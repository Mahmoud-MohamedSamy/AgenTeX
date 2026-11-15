const G = 'mmohamed@anyware.software';
out.unblock = (await api('DELETE', '/desk/channels/spam-contacts?address=' + encodeURIComponent(G))).s;
out.stillBlocked = JSON.stringify(D((await api('GET', '/desk/channels/spam-contacts?limit=200')).j)).includes(G);
out.t = new Date().toISOString();
return fin({ out });
