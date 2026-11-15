const found = async () => arr(D((await api('GET', '/modules/' + TM + '/records?limit=20&q=' + encodeURIComponent('QA GL W4 blocked'))).j)).map(flat).filter(t => /QA GL W4 blocked/i.test(t.subject || '')).map(t => ({ n: t.ticket_number, id: t.id, st: t.status, at: t.created_at }));
out.polls = [];
for (let i = 0; i < 6; i++) { const f = await found(); out.polls.push(f.length); if (f.length) { out.ticket = f; break; } await sleep(30000); }
const sp = await api('GET', '/desk/channels/spam-contacts?limit=200'); out.stillBlocked = JSON.stringify(D(sp.j)).includes('mmohamed@anyware.software');
for (const p of ['/desk/channels/spam-log?limit=10', '/desk/channels/blocked-messages?limit=10', '/desk/channels/inbound?limit=10', '/desk/channels/suppressions?limit=10']) { const r = await api('GET', p); out[p.split('?')[0]] = r.s + ' ' + (r.s === 200 ? JSON.stringify(D(r.j)).slice(0, 300) : ''); }
const spamT = arr(D((await api('GET', '/modules/' + TM + '/records?limit=10&sort=-created_at&q=' + encodeURIComponent('blocked'))).j)).map(flat).slice(0, 5).map(t => t.ticket_number + ' ' + String(t.subject).slice(0, 40) + ' ' + t.status); out.recentBlocked = spamT;
return fin({ out });
