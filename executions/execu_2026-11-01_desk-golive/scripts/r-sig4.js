const o = {}; const TK = 'f2fa192d-843d-4deb-b967-7383e71e882f', D = 'eabd8e2d-bd2a-4c72-b6c8-8a3accecdd60';
await go('/settings/personal/signatures', 10000); const ed = page.locator('[contenteditable=true]').first();
if (await ed.count()) { await ed.click(); await page.keyboard.press('Control+A'); await page.keyboard.type('QA GL W2 signature line', { delay: 25 }); await page.locator('button', { hasText: /^Save signature$/ }).first().click().catch(() => {}); await sleep(4000); }
o.sigSaved = (await api('GET', '/mail/signatures/me')).t.slice(0, 120);
const d = await api('GET', `/desk/tickets/${TK}/drafts/mine`); o.draftStatus = d.j && d.j.data && d.j.data.status;
const ap = await api('POST', `/desk/tickets/${TK}/drafts/${D}/approve`, {}); o.approve = ap.s + ' ' + ap.t.slice(0, 300);
await sleep(8000);
const rl = await api('GET', `/desk/tickets/${TK}/replies`); o.replies = arr(rl.j && rl.j.data).map(r => [r.status, r.subject, JSON.stringify(r.to), r.created_at, /signature line/.test(JSON.stringify(r))]);
o.sigDel = (await api('DELETE', '/mail/signatures/me')).s; o.sigAfter = (await api('GET', '/mail/signatures/me')).t.slice(0, 80);
return done(o);
