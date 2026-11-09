const d = page.locator('[role=dialog]').first();
const i = d.locator('input[type=email]'); await i.fill('mmohamed@anyware.software'); await i.press('Enter'); await sleep(600);
await d.locator('button', { hasText: /^Next$/ }).click(); await sleep(1500);
await shot('s02-sched-step3');
const txt = (await d.innerText()).replace(/\s+/g, ' ');
const ctrls = await page.$$eval('[role=dialog] input, [role=dialog] select, [role=dialog] button', es => es.map(e => [e.tagName, e.getAttribute('type'), e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.innerText.trim().slice(0, 30), e.tagName === 'SELECT' ? [...e.options].map(o => o.text).join('/') : ''].join(':')));
return { txt: txt.slice(0, 1800), ctrls };
