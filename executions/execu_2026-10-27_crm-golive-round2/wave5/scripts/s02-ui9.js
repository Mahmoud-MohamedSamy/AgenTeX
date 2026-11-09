const R = '564a6465-eba0-4bea-97d2-7bab1412f6fc';
const t0 = Date.now();
await page.goto(H + '/reports/' + R, { waitUntil: 'domcontentloaded' });
let t = '';
for (let i = 0; i < 30; i++) { await sleep(1000); t = (await page.innerText('main')).replace(/\s+/g, ' '); if (/R5-0003/.test(t)) break; }
const secs = (Date.now() - t0) / 1000;
await shot('s02-report-view');
const btns = await page.$$eval('main button, main [role=menuitem], main a', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(Boolean));
return { url: page.url().replace(H, ''), secs, text: t.slice(0, 1200), btns: [...new Set(btns)].slice(0, 60) };
