const LINK = 'https://staging-desk.taviportal.com/happiness/dh1.a7a7a7a7000000000000000000000004.H0kpE6GY_OWjW-BUtdfRE_ASRmxo7tbMMEc-9nb2LL8';
const mine = async () => arr(D((await api('GET', '/desk/happiness/ratings?limit=50')).j)).filter(x => x.ticket_number == 3929).map(x => ({ r: x.rating, fb: String(x.feedback || '').slice(0, 60), len: String(x.feedback || '').length, at: x.submitted_at }));
const p2 = await page.context().newPage(); const net = []; p2.on('response', async r => { if (r.request().method() !== 'GET') net.push(r.request().method() + ' ' + r.url().replace(/dh1\.[^/?]+/, 'TOKEN').replace(/^https:\/\/[^/]+/, '') + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 150)); });
const rate = async (q, opt, comment, tag) => { await p2.goto(LINK.replace(/(dh1\.[^/]+)/, m => q === 'tamper' ? m.slice(0, -4) + 'AAAA' : m) + (q === 'tamper' ? '' : '?rating=' + opt), { waitUntil: 'domcontentloaded', timeout: 60000 }); await p2.waitForTimeout(5000);
  const before = (await p2.innerText('body')).replace(/\s+/g, ' ').slice(0, 300);
  if (q === 'tamper') { await p2.screenshot({ path: SHOT + '/w4/r-' + tag + '.png' }); return { before }; }
  await p2.getByRole('button', { name: new RegExp(opt, 'i') }).first().click().catch(() => {}); await p2.waitForTimeout(800);
  if (comment) await p2.locator('textarea').first().fill(comment).catch(e => net.push('fill ' + e.message.slice(0, 60)));
  const n0 = net.length; await p2.getByRole('button', { name: /^Submit/ }).click().catch(e => net.push('submit ' + e.message.slice(0, 60))); await p2.waitForTimeout(5000);
  await p2.screenshot({ path: SHOT + '/w4/r-' + tag + '.png' }); return { before, after: (await p2.innerText('body')).replace(/\s+/g, ' ').slice(0, 300), net: net.slice(n0) }; };
out.w73 = await rate('', 'good', 'QA GL W4R good', 'W4-73-good'); out.r1 = await mine();
out.w74 = await rate('', 'bad', 'QA GL W4R changed my mind', 'W4-74-bad'); out.r2 = await mine();
out.w75 = await rate('tamper', '', '', 'W4-75-tampered'); out.r3 = await mine();
const ar = ('تجربة اختبار QA GL W4R تعليق طويل باللغة العربية للتحقق من الحفظ الكامل والاتجاه من اليمين إلى اليسار. ').repeat(8);
await p2.goto('https://staging-desk.taviportal.com/ar', { waitUntil: 'commit' }).catch(() => {});
out.w76 = await rate('', 'bad', ar, 'W4-76-arabic'); out.arLen = ar.length; out.r4 = await mine();
out.dir = await p2.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang);
await p2.close();
return fin({ out });
