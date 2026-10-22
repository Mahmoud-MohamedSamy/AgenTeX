const sc = await page.evaluate(() => [...document.querySelectorAll('*')].filter(e => { const s = getComputedStyle(e); return /(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 2 && e.clientHeight > 50; }).map(e => ({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 80), ch: e.clientHeight, sh: e.scrollHeight, text: e.innerText.slice(0, 40).replace(/\n/g, ' ') })));
const doc = await page.evaluate(() => ({ sh: document.documentElement.scrollHeight, ch: document.documentElement.clientHeight }));
return done({ sc, doc });
