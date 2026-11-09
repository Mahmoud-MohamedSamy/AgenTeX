await sleep(4000);
await shot('s02-builder2');
const t = (await page.innerText('body')).replace(/\s+/g, ' ');
const btns = await page.$$eval('main button, main [role=tab]', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(Boolean));
return { text: t.slice(t.indexOf('Meetings') + 8, t.indexOf('Meetings') + 2500), btns: [...new Set(btns)].slice(0, 80) };
