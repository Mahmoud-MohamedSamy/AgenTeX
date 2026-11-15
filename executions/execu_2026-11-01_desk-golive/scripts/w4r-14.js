const L76 = 'https://staging-desk.taviportal.com/happiness/dh1.a7a7a7a7000000000000000000000004.NBWxpubSdcvCp_yMggiAwGFYjNO7wdkn_jvPDtLbnY0';
const p2 = await page.context().newPage(); const net = []; p2.on('response', async r => { if (r.request().method() !== 'GET') net.push(r.request().method() + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 160)); });
const res = {};
for (const q of ['?rating=bad&lang=ar', '?rating=bad&locale=ar', '?rating=bad&hl=ar']) { await p2.goto(L76 + q, { waitUntil: 'domcontentloaded' }); await p2.waitForTimeout(4000); res[q] = await p2.evaluate(() => document.documentElement.lang + '/' + document.documentElement.dir + ' | ' + document.body.innerText.replace(/\s+/g, ' ').slice(0, 120)); }
out.langTry = res;
out.switcher = await p2.locator('button, a, select').evaluateAll(es => es.map(e => (e.innerText || e.getAttribute('aria-label') || '').trim()).filter(t => /عرب|arab|lang|EN|English/i.test(t)).slice(0, 5));
const ar = ('تجربة اختبار QA GL W4R تعليق طويل باللغة العربية للتحقق من الحفظ الكامل والاتجاه من اليمين إلى اليسار. ').repeat(8); out.arLen = ar.length;
await p2.getByRole('button', { name: /bad|سيئ/i }).first().click().catch(() => {});
const ta = p2.locator('textarea').first(); out.maxlen = await ta.getAttribute('maxlength').catch(() => null); await ta.fill(ar);
out.taDir = await ta.evaluate(e => getComputedStyle(e).direction + ' dir=' + e.getAttribute('dir'));
await p2.screenshot({ path: SHOT + '/w4/W4-76-filled.png' });
await p2.getByRole('button', { name: /Submit|إرسال/ }).click(); await p2.waitForTimeout(5000);
out.after = (await p2.innerText('body')).replace(/\s+/g, ' ').slice(0, 300); out.net = net; await p2.screenshot({ path: SHOT + '/w4/W4-76-done.png' }); await p2.close();
const rr = arr(D((await api('GET', '/desk/happiness/ratings?limit=50')).j)).find(x => x.ticket_number == 3940); out.saved = rr && { r: rr.rating, len: String(rr.feedback || '').length, same: rr.feedback === ar, trimmedSame: String(rr.feedback).trim() === ar.trim() };
return fin({ out });
