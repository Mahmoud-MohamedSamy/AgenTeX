const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const LID = 'c5bbf73c-0a86-48b4-a8bc-4f394b4e11e5'; const R = { posts: [] };
page.on('response', async r => { if (r.request().method() === 'POST' && /\/records(\?|$)/.test(r.url())) R.posts.push(r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 220)); });
const open = async () => { await page.goto(H + '/modules/' + MID + '/records/new?layout=' + LID, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-rule-field]', { timeout: 30000 }).catch(() => {}); await sleep(3000); const i = page.locator('[data-rule-field="first_name"] input').first(); await i.fill('QA RT18 E2M4 ui'); await sleep(300); };
const msgInfo = (txt) => page.evaluate(txt => { const all = [...document.querySelectorAll('body *')].filter(e => e.childElementCount === 0 && (e.innerText || '').includes(txt)); return all.slice(0, 3).map(e => { const r = e.getBoundingClientRect(); const box = e.closest('[role=alert],[aria-live]'); return { top: Math.round(r.top), bottom: Math.round(r.bottom), inView: r.bottom > 0 && r.top < innerHeight && r.height > 0, inField: !!e.closest('[data-rule-field]'), live: box ? (box.getAttribute('role') || '') + '/' + (box.getAttribute('aria-live') || '') : null }; }); }, txt);
const scrollY = () => page.evaluate(() => { const els = [document.scrollingElement, ...document.querySelectorAll('main, [class*=overflow-y-auto], [class*=overflow-auto]')].filter(Boolean); return els.map(e => Math.round(e.scrollTop)).filter(x => x > 0); });
// E2 top
await open();
const pk = page.locator('[data-rule-field="qa_rt18v_pick"]').first(); await pk.scrollIntoViewIfNeeded(); await pk.locator('button[role=combobox]').first().click(); await sleep(600); await page.getByRole('option', { name: 'Reject', exact: true }).first().click(); await sleep(800);
R.scrollBefore = await scrollY(); await shot('3017-1-before-save.png');
await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000);
R.scrollAfter = await scrollY(); R.e2msg = await msgInfo('E2 pick cannot be Reject');
R.pickMarked = await page.evaluate(() => { const w = document.querySelector('[data-rule-field="qa_rt18v_pick"]'); const c = w && w.querySelector('button[role=combobox],input'); return { ariaInvalid: c && c.getAttribute('aria-invalid'), text: w && w.innerText.replace(/\s+/g, ' ').slice(0, 120), cls: c && (c.className.match(/(red|destructive|danger|error)[^ ]*/g) || []).join(' ') }; });
R.focus = await page.evaluate(() => { const e = document.activeElement; return e ? ((e.closest('[data-rule-field]') || {}).getAttribute?.('data-rule-field') || e.tagName + ' ' + (e.innerText || '').slice(0, 30)) : null; });
await shot('3017-2-after-save.png');
return R;
