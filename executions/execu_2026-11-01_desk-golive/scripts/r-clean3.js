const o = {}; const TM = '88e8ea44-1658-4df3-9930-d0902b91073d';
o.macro = (await api('DELETE', '/desk/macros/f723e149-1ef7-4987-af11-6edee2b61580')).s;
o.view = (await api('DELETE', `/modules/${TM}/views/7bc907e3-7066-4e33-b1b6-3637c9dd193f`)).s;
const check = {}; for (const p of ['/desk/macros', '/desk/snippets', '/desk/ticket-templates', '/desk/tags', `/modules/${TM}/views`, '/desk/scheduled-replies']) { const r = await api('GET', p); check[p] = (r.t.match(/QA GL W2|qa_gl_w2/gi) || []).length; }
const l = await api('GET', `/modules/${TM}/records?limit=50&q=` + encodeURIComponent('QA GL W2')); check.tickets = arr(l.j && l.j.data).map(fl).filter(x => /QA GL W2/.test(x.subject || '')).length;
const b = await api('GET', '/audit/recycle-bin/items?limit=200&app=desk'); check.binQA = arr(b.j && b.j.data).filter(x => /QA GL W2/.test(x.record_label || '')).map(x => [x.record_label, x.module_label]);
check.sig = (await api('GET', '/mail/signatures/me')).t.includes('"signatures":[]');
o.check = check; return done(o);
