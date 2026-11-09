const res = {};
const l = zpage.locator('a, span, div', { hasText: /^Leads by Source$/ }).first();
res.found = await l.count();
if (res.found) { await l.scrollIntoViewIfNeeded().catch(() => {}); await l.click(); }
for (let i = 0; i < 25; i++) { await sleep(2000); const t = await zpage.innerText('body').catch(() => ''); if (/Export|Schedule|Total/i.test(t) && t.length > 800) break; }
await sleep(4000); await shot('z-report-view', zpage);
res.url = zpage.url();
const t = (await zpage.innerText('body')).replace(/\s+/g, ' '); res.text = t.slice(t.indexOf('Invoices') + 8, t.indexOf('Invoices') + 1500);
res.buttons = [...new Set(await zpage.$$eval('button, [role=button], a.btn, lyte-button', bs => bs.map(b => (b.getAttribute('aria-label') || b.getAttribute('title') || b.innerText || '').trim()).filter(x => x && x.length < 40)))].slice(0, 50);
return res;
