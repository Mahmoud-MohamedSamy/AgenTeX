// NDC-1232: Data Types table — header background while scrolled, overflow affordance, row height, wrapping.
await page.setViewportSize({ width: 1280, height: 866 });
await page.goto(H + '/settings/data-types', { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/Permanently Delete|Create Layout Rule/.test(await txt().catch(() => ''))) break; } await sleep(2000);
await shot('1232-01-top');
const m = await page.evaluate(() => { const th = document.querySelector('thead th'); const thead = th.closest('thead'); const tbl = th.closest('table'); const sc = (() => { let c = tbl.parentElement; while (c && !(c.scrollWidth > c.clientWidth + 1 || /auto|scroll/.test(getComputedStyle(c).overflowX))) c = c.parentElement; return c; })(); const bg = el => getComputedStyle(el).backgroundColor; const ths = [...thead.querySelectorAll('th')]; return { theadBg: bg(thead), thBg: ths.map(bg).slice(0, 3), sticky: getComputedStyle(th).position + '/' + getComputedStyle(thead).position, tableW: Math.round(tbl.getBoundingClientRect().width), areaW: sc ? sc.clientWidth : null, scrollW: sc ? sc.scrollWidth : null, overflowX: sc ? getComputedStyle(sc).overflowX : null, headers: ths.map(t => t.innerText.trim()).filter(Boolean), lastRight: Math.round(ths[ths.length - 1].getBoundingClientRect().right), rowH: Math.round(tbl.querySelector('tbody tr').getBoundingClientRect().height) }; });
// scroll body and check header still opaque over rows
await page.evaluate(() => { const t = document.querySelector('table'); let c = t.parentElement; while (c && c.scrollHeight <= c.clientHeight + 2) c = c.parentElement; (c || document.scrollingElement).scrollTop = 400; }); await sleep(800);
await shot('1232-02-scrolled');
return done(m);
