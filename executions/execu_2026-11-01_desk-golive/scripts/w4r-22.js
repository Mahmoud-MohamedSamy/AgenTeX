const found = async q => arr(D((await api('GET', '/modules/' + TM + '/records?limit=20&q=' + encodeURIComponent(q))).j)).map(flat).filter(t => new RegExp(q, 'i').test(t.subject || '')).map(t => ({ n: t.ticket_number, id: t.id, st: t.status, at: t.created_at, dep: t.department }));
out.polls = [];
for (let i = 0; i < 10; i++) { const f = await found('QA GL W4 unblocked'); out.polls.push(f.length); if (f.length) { out.ticket = f; break; } await sleep(30000); }
out.blockedLater = await found('QA GL W4 blocked$');
if (out.ticket) { await go('/views/all/tickets/' + out.ticket[0].id, 10000); await shot('w4/W4-12-unblocked-ticket'); }
return fin({ out });
