await page.goto(H + '/settings/teamspace', { waitUntil: 'domcontentloaded' }); await sleep(5000);
await page.locator('main button', { hasText: /Create New Teamspace/ }).first().click(); await sleep(3000);
await shot('c12-create');
const t = (await page.innerText('main')).replace(/\s+/g, ' ');
const ctrls = await page.$$eval('main input, main textarea, main button, main select', es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.placeholder || e.innerText || '').trim().slice(0, 40)));
return { url: page.url().replace(H, ''), t: t.slice(t.indexOf('Create'), t.indexOf('Create') + 1500), ctrls: ctrls.filter(Boolean).slice(-40) };
