const o = {}; const TK = 'f2fa192d-843d-4deb-b967-7383e71e882f';
o.sigBefore = (await api('GET', '/mail/signatures/me')).t.slice(0, 140);
await page.goto(H + '/views/all/tickets/' + TK, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(12000);
const rb = page.locator('button', { hasText: /^Reply/ }).first(); o.replyBtn = await rb.count(); if (o.replyBtn) { await rb.click().catch(() => {}); await sleep(5000); }
o.composer = await page.$$eval('[contenteditable=true]', es => es.filter(e => e.offsetParent !== null).map(e => e.innerText.slice(0, 200)));
o.sigShown = /QA GL W2 signature line/.test(await txt()); o.shotSig = await shot('../wave2n/r-signature-composer2');
// 30 MB file through the composer attach button
const fi = page.locator('input[type=file]').last(); o.fileInputs = await page.locator('input[type=file]').count();
if (o.fileInputs) { await fi.setInputFiles('C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/f8ef493a-ea8b-46bf-90e4-4def7dea2502/scratchpad/qa-gl-w2-30mb.txt').catch(e => o.setErr = e.message.slice(0, 80)); await sleep(8000); o.afterAttach = ((await txt()).match(/[^\n]{0,80}(MB|too large|limit|exceed|size)[^\n]{0,80}/gi) || []).slice(0, 4); o.shotBig = await shot('../wave2n/r-attach-30mb'); }
// leave without sending: discard draft
await page.keyboard.press('Escape'); await sleep(800);
for (const re of [/^Discard/, /^Cancel$/]) { const b = page.locator('button', { hasText: re }).first(); if (await b.count()) { await b.click().catch(() => {}); await sleep(1200); } }
const dd = page.locator('[role=dialog] button', { hasText: /Discard|Yes|Delete/i }).first(); if (await dd.count()) await dd.click().catch(() => {});
await api('DELETE', '/desk/tickets/' + TK + '/drafts/mine');
// remove signature
await go('/settings/personal/signatures', 10000); const ed2 = page.locator('[contenteditable=true]').first(); if (await ed2.count()) { await ed2.click(); await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await sleep(500); await page.locator('button', { hasText: /^Save signature$/ }).first().click().catch(() => {}); await sleep(4000); }
o.sigAfter = (await api('GET', '/mail/signatures/me')).t.slice(0, 140);
o.sigDel = (await api('DELETE', '/mail/signatures/me')).s; o.sigAfter2 = (await api('GET', '/mail/signatures/me')).t.slice(0, 140);
return done(o);
