await page.goto(H + '/settings/integration-config', { waitUntil: 'domcontentloaded' }); await sleep(4000);
await page.locator('main button', { hasText: /^Create integration$/ }).first().click(); await sleep(2000);
await shot('i02-create-dialog');
const d = await page.locator('[role=dialog]').count();
const text = d ? (await page.locator('[role=dialog]').first().innerText()).replace(/\s+/g, ' ') : (await page.innerText('main')).replace(/\s+/g, ' ').slice(-1200);
const ctrls = await page.$$eval('[role=dialog] input, [role=dialog] button, [role=dialog] select, [role=dialog] [role=checkbox]', es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.placeholder || e.innerText || '').trim().slice(0, 40)));
return { d, text: text.slice(0, 1500), ctrls };
