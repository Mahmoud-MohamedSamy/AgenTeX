const o = {}; const BASE = 'd09976e5-45fc-460c-b7d5-2e7bd261ecc9';
await page.goto(H + '/views/all/tickets/' + BASE, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(12000);
const cb = page.locator('button[aria-label*="omment"], button[title*="omment"]').first(); o.cbtn = await cb.count(); if (o.cbtn) await cb.click().catch(() => {}); else await page.keyboard.press('Shift+C');
await sleep(3000); const ed = page.locator('[contenteditable=true]').last(); o.editor = await ed.count(); o.editorStart = o.editor ? (await ed.innerText()).slice(0, 80) : '';
if (o.editor) { await ed.click(); await page.keyboard.type('QA GL W2 screen mention ', { delay: 30 }); await page.keyboard.type('@mahmoud.ma', { delay: 90 }); await sleep(3500);
  o.options = await page.$$eval('[role=option]', es => es.filter(e => e.offsetParent !== null).map(e => e.innerText.replace(/\s+/g, ' ').trim()).slice(0, 6));
  const opt = page.locator('[role=option]').filter({ hasText: /mahmoud.mahamed1515/ }).first(); o.pick = await opt.count(); if (o.pick) await opt.click().catch(() => {}); else await page.keyboard.press('Enter');
  await sleep(800); await page.keyboard.type(' please look', { delay: 20 }); o.shotBefore = await shot('../wave2n/r-mention-screen-before');
  const add = page.locator('button', { hasText: /^(Add comment|Comment|Add|Save|Post)$/ }).last(); o.add = await add.count(); if (o.add) await add.click().catch(() => {}); else await page.keyboard.press('Control+Enter');
  await sleep(6000); o.shotAfter = await shot('../wave2n/r-mention-screen-after'); }
const lc = await api('GET', `/desk/tickets/${BASE}/comments`); o.saved = arr(lc.j && lc.j.data).filter(x => /screen mention/.test(x.body_html || '')).map(x => ({ body: (x.body_html || '').slice(0, 300), keys: Object.keys(x).join(',') }));
return done(o);
