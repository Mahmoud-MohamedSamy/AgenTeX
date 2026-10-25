await go('/workqueue/activities/tasks', 12000);
const t = (await txt()).split('Meetings')[1]?.slice(0, 1500);
await shot('wq-00-tasks');
const btns = await page.locator('main button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 30)).filter(Boolean).slice(0, 50));
return done({ url: page.url(), t, btns });
