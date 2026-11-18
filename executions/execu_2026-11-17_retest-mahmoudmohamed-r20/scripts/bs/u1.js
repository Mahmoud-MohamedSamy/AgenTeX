const ID = '9ec8bdc5-2362-4386-a4cd-e5bee332d0c7'; const out = {}; const LANG = process.env.LANG2 || 'en'; const K = process.env.K || 'a';
await page.goto(H + '/views/all/tickets/' + ID, { waitUntil: 'commit' }); await page.evaluate(l => localStorage.setItem('anyware_language', l), LANG); await page.reload({ waitUntil: 'domcontentloaded' });
const VCA = LANG === 'en' ? 'View configured actions' : null;
for (let i = 0; i < 40; i++) { await sleep(3000); const t = await text(); if (/QA go|QA urgent|No transitions/.test(t) && t.length > 800) break; }
await sleep(4000);
const t = (await text()).replace(/\s+/g, ' ');
out.ro = /read this ticket but not change/i.test(t);
out.btns = await page.getByRole('button').evaluateAll(es => es.map(e => e.innerText.trim()).filter(x => x && x.length < 60));
out.links = await page.locator('a,button,[role=link]').evaluateAll(es => es.map(e => e.innerText.trim()).filter(x => /configured|الإجراءات|الخطوات|المسار|إعداد/.test(x)));
await shot('3056-' + K + '1-header-' + LANG + '.png');
// find header link: first candidate
const cand = page.locator('a,button,[role=link]').filter({ hasText: LANG === 'en' ? /View configured actions/ : /./ });
let link = LANG === 'en' ? page.getByText('View configured actions').first() : page.locator('[data-x]').first();
if (LANG !== 'en') { const lbl = process.env.ARL; link = page.getByText(lbl, { exact: false }).first(); }
const box = await link.boundingBox().catch(() => null); out.linkBox = box;
await link.click(); await sleep(3500);
const d = page.getByRole('dialog').first(); out.popup = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ');
await shot('3056-' + K + '2-popup-' + LANG + '.png');
const sc = await d.evaluate(e => { const els = [e, ...e.querySelectorAll('*')].filter(x => x.scrollHeight > x.clientHeight + 20 && getComputedStyle(x).overflowY !== 'visible'); return els.map(x => [x.scrollHeight, x.clientHeight]); }).catch(() => null); out.scroll = sc;
if (sc && sc.length) { await d.evaluate(e => { [e, ...e.querySelectorAll('*')].filter(x => x.scrollHeight > x.clientHeight + 20 && getComputedStyle(x).overflowY !== 'visible').forEach(x => x.scrollTop = x.scrollHeight); }); await sleep(800); await shot('3056-' + K + '3-popup-bottom-' + LANG + '.png'); }
return out;
