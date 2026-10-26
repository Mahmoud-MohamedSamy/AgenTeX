await page.mouse.click(56, 569); await sleep(2500);
const nav = await page.evaluate(() => { const n = document.querySelector('nav.sidebar-scroll') || document.querySelector('nav'); return n ? n.innerText.split('\n').map(s => s.trim()).filter(Boolean) : []; });
await shot('1695-02-left-nav');
return done({ nav: nav.slice(0, 40) });
