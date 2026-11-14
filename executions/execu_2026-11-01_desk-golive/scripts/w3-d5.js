out.del = (await api('DELETE', '/desk/channels/spam-contacts?address=' + encodeURIComponent('qa-gl-w3-spam@example.com'))).s;
out.list = JSON.stringify(D((await api('GET', '/desk/channels/spam-contacts')).j)).slice(0, 200);
out.settings = (await api('GET', '/desk/tickets/spam/settings')).t.slice(0, 200);
return fin({ out });
