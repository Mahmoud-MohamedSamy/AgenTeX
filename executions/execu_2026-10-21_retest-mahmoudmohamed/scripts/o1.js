await go('/settings', 8000);
await page.getByText('Data Types', { exact: true }).first().click(); await sleep(8000);
await page.setViewportSize({ width: 1272, height: 866 }); await sleep(1500);
await shot('1232-01-top');
const m = await page.evaluate(() => { const th = [...document.querySelectorAll('thead th')]; const tb = document.querySelector('table'); const rows = [...document.querySelectorAll('tbody tr')]; const sc = (() => { let p = tb; while (p && !(p.scrollHeight > p.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(p).overflowY))) p = p.parentElement; return p; })();
  return { headers: th.map(h => h.innerText.trim()), thPos: th[0] && getComputedStyle(th[0]).position, theadPos: document.querySelector('thead') && getComputedStyle(document.querySelector('thead')).position, rowH: rows.slice(0, 12).map(r => Math.round(r.getBoundingClientRect().height)), wraps: rows.slice(0, 30).map(r => [...r.cells].slice(0, 3).map(c => c.innerText.includes('\n') ? 'WRAP:' + c.innerText.replace(/\n/g, '/') : '').filter(Boolean)).flat(), tableW: Math.round(tb.getBoundingClientRect().width), contW: sc ? Math.round(sc.clientWidth) : null, hscroll: sc ? sc.scrollWidth > sc.clientWidth + 2 : null, scTag: sc && sc.className.slice(0, 60) }; });
// scroll down inside the scroller
await page.evaluate(() => { const tb = document.querySelector('table'); let p = tb; while (p && !(p.scrollHeight > p.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(p).overflowY))) p = p.parentElement; if (p) p.scrollTop = 600; });
await sleep(800);
const hdrVisible = await page.evaluate(() => { const r = document.querySelector('thead th')?.getBoundingClientRect(); return r && r.top >= 0 && r.top < window.innerHeight ? Math.round(r.top) : 'not visible'; });
await shot('1232-02-scrolled');
return done({ ...m, hdrVisibleAfterScroll: hdrVisible });
