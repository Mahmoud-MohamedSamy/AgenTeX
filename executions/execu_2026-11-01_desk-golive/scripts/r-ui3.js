// 12 Nov resume, owner screen checks round 3
const o = {}; const EMAIL = '9804a4f1-b4d3-4b76-8638-3837001ceedc';
const flat = async () => (await txt()).replace(/\s+/g, ' ');
const side = async (name) => { await go('/settings/personal/signatures', 9000); const l = page.locator('a, button, [role=link]', { hasText: new RegExp('^' + name + '$') }).first(); const n = await l.count(); if (n) { await l.click().catch(() => {}); await sleep(12000); } return n; };
// W2-13 template via native select
await go(`/modules/${T}/records/new`, 9000);
const dep = page.locator('text=Department').locator('xpath=following::*[@role="combobox" or self::button or self::input][1]').first();
await dep.click().catch(() => {}); await sleep(1500); await page.keyboard.type('Marketing', { delay: 40 }); await sleep(1500);
const mo = page.locator('[role=option]', { hasText: /^Marketing$/ }).first(); if (await mo.count()) await mo.click().catch(() => {}); await sleep(3000);
const sel = page.locator('select', { has: page.locator('option', { hasText: /QA GL W2 template/ }) }).first(); o.sel = await sel.count();
if (o.sel) { const val = await sel.locator('option', { hasText: /QA GL W2 template/ }).first().getAttribute('value'); await sel.selectOption(val); await sleep(4000); }
const dlg = page.locator('[role=dialog]').last(); if (await dlg.count()) { o.tplDialog = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); const ok = dlg.locator('button', { hasText: /Apply|Replace|Yes|OK|Continue/i }).first(); if (await ok.count()) { await ok.click().catch(() => {}); await sleep(3000); } }
o.filled = await page.$$eval('input, textarea', is => is.filter(i => i.offsetParent !== null && i.value && i.type !== 'color').map(i => [i.name || i.getAttribute('aria-label') || i.placeholder, i.value.slice(0, 60)]).slice(0, 15));
o.prio = ((await flat()).match(/Priority.{0,40}/) || [''])[0];
o.shotTpl = await shot('../wave2n/r-template-prefill3');
const c = page.locator('button', { hasText: /^Cancel$/ }).first(); if (await c.count()) await c.click().catch(() => {}); await sleep(1500); const lv = page.locator('[role=dialog] button', { hasText: /Discard|Leave|Yes/i }).first(); if (await lv.count()) await lv.click().catch(() => {});
// W2-30 signature in the composer (not sent)
await go('/settings/personal/signatures', 10000); const ed = page.locator('[contenteditable=true]').first();
if (await ed.count()) { await ed.click(); await page.keyboard.type('QA GL W2 signature line', { delay: 25 }); await page.locator('button', { hasText: /^Save signature$/ }).first().click().catch(() => {}); await sleep(4000); }
o.sigApi = (await api('GET', '/mail/signatures/me')).t.slice(0, 160);
await page.goto(H + '/views/all/tickets/' + EMAIL, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(12000);
const rb = page.locator('button', { hasText: /^Reply All$|^Reply$/ }).first(); o.replyBtn = await rb.count(); if (o.replyBtn) { await rb.click().catch(() => {}); await sleep(5000); }
o.composer = await page.$$eval('[contenteditable=true]', es => es.filter(e => e.offsetParent !== null).map(e => e.innerText.slice(0, 200)));
o.sigShown = /QA GL W2 signature line/.test(await txt()); o.shotSig = await shot('../wave2n/r-signature-composer');
await page.keyboard.press('Escape'); await sleep(1000); const disc = page.locator('button', { hasText: /^Discard|^Cancel/ }).first(); if (await disc.count()) await disc.click().catch(() => {}); await sleep(1000); const dd = page.locator('[role=dialog] button', { hasText: /Discard|Yes|Delete/i }).first(); if (await dd.count()) await dd.click().catch(() => {});
await go('/settings/personal/signatures', 10000); const ed2 = page.locator('[contenteditable=true]').first(); if (await ed2.count()) { await ed2.click(); await page.keyboard.press('Control+A'); await page.keyboard.press('Delete'); await page.locator('button', { hasText: /^Save signature$/ }).first().click().catch(() => {}); await sleep(3000); }
o.sigAfter = (await api('GET', '/mail/signatures/me')).t.slice(0, 120);
const dr = await api('GET', `/desk/tickets/${EMAIL}/drafts`); o.draftsLeft = arr(dr.j && dr.j.data).map(d => [d.review_state, (d.body_html || '').slice(0, 40)]);
// Setup pages
for (const n of ['Ticket Number', 'Data Sharing', 'Roles']) { o['nav ' + n] = await side(n); o['url ' + n] = page.url(); o['page ' + n] = ((await flat()).match(new RegExp(n + '.{0,800}', 'g')) || []).pop(); o['shot ' + n] = await shot('../wave2n/r-' + n.replace(/ /g, '-').toLowerCase()); }
return done(o);
