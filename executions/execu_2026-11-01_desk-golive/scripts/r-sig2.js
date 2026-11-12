const o = {}; const TK = 'f2fa192d-843d-4deb-b967-7383e71e882f';
await go('/settings/personal/signatures', 10000); const ed = page.locator('[contenteditable=true]').first();
if (await ed.count()) { await ed.click(); await page.keyboard.type('QA GL W2 signature line', { delay: 25 }); await page.locator('button', { hasText: /^Save signature$/ }).first().click().catch(() => {}); await sleep(4000); }
o.sigSaved = (await api('GET', '/mail/signatures/me')).t.slice(0, 140);
await page.goto(H + '/views/all/tickets/' + TK, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(12000);
const rb = page.locator('button', { hasText: /^Reply/ }).first(); o.replyBtn = await rb.count(); if (o.replyBtn) { await rb.click().catch(() => {}); await sleep(5000); }
const e2 = page.locator('[contenteditable=true]').last(); await e2.click().catch(() => {}); await page.keyboard.press('Control+Home'); await page.keyboard.type('QA GL W2 signature test 2, sent from the TAVI screen composer. Please check whether the signature line appears below.', { delay: 10 });
o.composerText = (await e2.innerText().catch(() => '')).slice(0, 300); o.shotBefore = await shot('../wave2n/r-sig2-composer');
const send = page.locator('button', { hasText: /^Send/ }).first(); o.sendBtn = await send.count(); if (o.sendBtn) { await send.click().catch(() => {}); await sleep(8000); }
o.shotAfter = await shot('../wave2n/r-sig2-sent');
const rl = await api('GET', `/desk/tickets/${TK}/replies`); o.replies = arr(rl.j && rl.j.data).map(r => [r.status, r.subject, (r.to || []).join(','), r.created_at, /signature line/.test(r.body_html || '')]);
await go('/settings/personal/signatures', 10000); o.sigDel = (await api('DELETE', '/mail/signatures/me')).s; o.sigAfter = (await api('GET', '/mail/signatures/me')).t.slice(0, 100);
return done(o);
