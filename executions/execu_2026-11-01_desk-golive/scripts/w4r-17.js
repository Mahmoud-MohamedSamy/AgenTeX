const G = 'mahmoud.mmohamedsamy@gmail.com';
const open = async () => arr(D((await api('GET', '/modules/' + TM + '/records?limit=100&q=' + encodeURIComponent(G))).j)).map(flat).filter(t => String(t.email || '').toLowerCase() === G);

const b = await open(); out.openNow = b.filter(t => t.status !== 'Closed').length; out.total = b.length;
const sp = arr(D((await api('GET', '/desk/channels/spam-contacts?limit=200')).j)).find(x => x.address === G); out.cascade = sp && sp.cascade_completed_at;
const u = await api('DELETE', '/desk/channels/spam-contacts?address=' + encodeURIComponent(G)); out.unblock = u.s;
out.stillBlocked = JSON.stringify(D((await api('GET', '/desk/channels/spam-contacts?limit=200')).j)).includes(G);
const mm = 'mmohamed@anyware.software'; const m = arr(D((await api('GET', '/modules/' + TM + '/records?limit=100&q=' + encodeURIComponent(mm))).j)).map(flat).filter(t => String(t.email || '').toLowerCase() === mm); out.mmOpen = m.filter(t => t.status !== 'Closed').map(t => t.ticket_number + ' ' + String(t.subject).slice(0, 35));
return fin({ out });
