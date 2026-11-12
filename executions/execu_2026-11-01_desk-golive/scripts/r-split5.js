const o = {}; await go('/views/all/tickets', 12000);
o.views = (await txt()).replace(/\s+/g, ' ').match(/.{0,40}(Spam|Unprocessed|Quarantine|Blocked).{0,60}/gi);
const s = await api('GET', '/search?app=desk&q=' + encodeURIComponent('split test')); o.search = arr(s.j && s.j.data && s.j.data.groups).map(g => [g.type, g.total, arr(g.hits).map(h => h.title && h.title.text).slice(0, 5)]);
for (const p of ['/desk/spam', '/desk/tickets/spam', '/mail/spam', '/mail/inbound?limit=10', '/mail/messages?direction=inbound&limit=10', '/desk/mail/inbound']) { const r = await api('GET', p); o[p] = r.s + ' ' + r.t.slice(0, 250); }
o.shot = await shot('../wave2n/r-split-list');
return done(o);
