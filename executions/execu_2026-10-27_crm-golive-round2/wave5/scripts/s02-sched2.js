await page.locator('main button', { hasText: /^New Report Scheduler$/ }).first().click(); await sleep(3000);
await shot('s02-sched-new');
const t = (await page.innerText('main')).replace(/\s+/g, ' ');
const d = await page.locator('[role=dialog]').count();
const txt = d ? (await page.locator('[role=dialog]').first().innerText()).replace(/\s+/g, ' ') : t;
const ctrls = await page.$$eval((d ? '[role=dialog] ' : 'main ') + 'input, ' + (d ? '[role=dialog] ' : 'main ') + 'select, ' + (d ? '[role=dialog] ' : 'main ') + 'button', es => es.map(e => [e.tagName, e.getAttribute('type'), e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.innerText.trim().slice(0, 30), e.tagName === 'SELECT' ? [...e.options].map(o => o.text).join('/').slice(0, 150) : ''].join(':')));
return { url: page.url().replace(H, ''), txt: txt.slice(0, 2500), ctrls: ctrls.slice(0, 60) };
