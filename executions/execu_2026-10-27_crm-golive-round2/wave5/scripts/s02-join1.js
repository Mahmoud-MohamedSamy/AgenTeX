await page.goto(H + '/reports', { waitUntil: 'domcontentloaded' }); await sleep(8000);
await page.locator('main button, main a', { hasText: /^Joined Report$/ }).first().click(); await sleep(4000);
await shot('s02-joined-new');
const dlg = await page.locator('[role=dialog]').count();
const t = dlg ? (await page.locator('[role=dialog]').first().innerText()) : (await page.innerText('main'));
const ctrls = await page.$$eval((dlg ? '[role=dialog] ' : 'main ') + 'button, ' + (dlg ? '[role=dialog] ' : 'main ') + 'input', es => es.map(e => (e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.innerText || '').trim().slice(0, 40)).filter(Boolean));
return { url: page.url().replace(H, ''), dlg, t: t.replace(/\s+/g, ' ').slice(0, 1500), ctrls };
