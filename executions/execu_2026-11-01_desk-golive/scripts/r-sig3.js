const o = {}; const TK = 'f2fa192d-843d-4deb-b967-7383e71e882f';
for (const p of ['/drafts', '/drafts/mine', '/replies', '/drafts?status=pending_review']) { const r = await api('GET', `/desk/tickets/${TK}${p}`); o[p] = r.s + ' ' + r.t.slice(0, 900); }
return done(o);
