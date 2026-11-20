const ID = process.env.TID; const LANG = process.env.LANG2 || 'en'; const K = process.env.K; const W = +(process.env.W || 1600); const WHICH = process.env.WHICH || 'last'; const out = {};
if (process.env.DARK) await page.emulateMedia({ colorScheme: 'dark' });
if (W !== 1600) await page.setViewportSize({ width: W, height: 900 });
await page.goto(H + '/views/all/tickets/' + ID, { waitUntil: 'commit' }); await page.evaluate(([l, th]) => { localStorage.setItem('anyware_language', l); if (th) { for (const k of Object.keys(localStorage)) if (/theme/i.test(k)) localStorage.setItem(k, th); } }, [LANG, process.env.THEME || '']); await page.reload({ waitUntil: 'domcontentloaded' });
const VCA = LANG === 'en' ? 'View configured actions' : 'عرض الإجراءات المُعدّة';
for (let i = 0; i < 40; i++) { await sleep(3000); const t = await text(); if (t.includes(VCA) && t.length > 800) break; }
await sleep(3000);
if (process.env.FD) { await page.evaluate(() => { document.documentElement.classList.add('dark'); document.documentElement.dataset.theme = 'dark'; document.documentElement.style.colorScheme = 'dark'; }); await sleep(800); }
out.dir = await page.evaluate(() => document.documentElement.dir + ' cls=' + document.documentElement.className + ' bg=' + getComputedStyle(document.body).backgroundColor);
out.themeKeys = await page.evaluate(() => Object.keys(localStorage).filter(k => /theme|lang/i.test(k)).map(k => k + '=' + localStorage.getItem(k)));
const links = page.getByText(VCA, { exact: true }); out.nLinks = await links.count();
out.linkBoxes = []; for (let i = 0; i < out.nLinks; i++) out.linkBoxes.push(await links.nth(i).boundingBox());
out.hscroll = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
await shot('3056-r3-' + K + '-ticket.png');
const L2 = WHICH === 'first' ? links.first() : links.last(); await L2.click(); await sleep(3000);
const d = page.getByRole('dialog').first(); out.popup = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ');
out.dBtns = await d.locator('button,a,[role=button]').evaluateAll(es => es.map(e => (e.innerText.trim() || e.getAttribute('aria-label') || '?'))).catch(() => null);
out.dbox = await d.boundingBox().catch(() => null);
out.dhs = await d.evaluate(e => [e.scrollWidth, e.clientWidth, document.documentElement.scrollWidth, document.documentElement.clientWidth]).catch(() => null);
// structure: elements with highlight classes / aria-current
out.marks = await d.evaluate(e => [...e.querySelectorAll('[aria-current],[data-current],[class*=current],[class*=active],[class*=highlight]')].slice(0, 30).map(x => (x.className + '').slice(0, 80) + ' :: ' + x.innerText.replace(/\s+/g, ' ').slice(0, 80))).catch(() => null);
await shot('3056-r3-' + K + '-popup.png');
const sc = await d.evaluate(e => [e, ...e.querySelectorAll('*')].filter(x => x.scrollHeight > x.clientHeight + 20 && getComputedStyle(x).overflowY !== 'visible').map(x => [x.scrollHeight, x.clientHeight])).catch(() => null); out.scroll = sc;
if (sc && sc.length) { for (let k = 1; k <= 3; k++) { await d.evaluate((e, k) => { [e, ...e.querySelectorAll('*')].filter(x => x.scrollHeight > x.clientHeight + 20 && getComputedStyle(x).overflowY !== 'visible').forEach(x => x.scrollTop = x.clientHeight * 0.85 * k); }, k); await sleep(700); await shot('3056-r3-' + K + '-popup-s' + k + '.png'); } }
await page.keyboard.press('Escape'); await sleep(1200); out.closedEsc = (await page.getByRole('dialog').count()) === 0;
return out;
