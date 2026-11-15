const G = 'mmohamed@anyware.software';
const list = async () => arr(D((await api('GET', '/modules/' + TM + '/records?limit=100&q=' + encodeURIComponent(G))).j)).map(flat).filter(t => String(t.email || '').toLowerCase() === G).map(t => ({ id: t.id, n: t.ticket_number, st: t.status }));
out.before = await list(); out.t0 = new Date().toISOString();
const b = await api('POST', '/desk/channels/spam-contacts', { address: G }); out.block = b.s + ' ' + b.t.slice(0, 200);
await sleep(30000);
const after = await list(); out.closedByBlock = after.filter(t => t.st === 'Closed' && (out.before.find(x => x.id === t.id) || {}).st !== 'Closed').map(t => t.n);
const sp = arr(D((await api('GET', '/desk/channels/spam-contacts?limit=200')).j)).find(x => x.address === G); out.blocked = !!sp; out.cascade = sp && sp.cascade_completed_at;
return fin({ out });
