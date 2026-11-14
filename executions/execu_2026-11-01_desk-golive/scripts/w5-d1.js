await go('/analytics/dashboards', 10000);
out.url = page.url().replace(H, ''); out.main = (await mtxt()).slice(0, 1200);
out.btns = await page.locator('main').getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)).filter(Boolean)).catch(() => []);
out.links = await page.locator('nav a, aside a').evaluateAll(es => es.map(e => e.innerText.trim() + '=' + e.getAttribute('href')).filter(x => /dash|analytic|report/i.test(x))).catch(() => []);
await shot('w5/W5-29-dashboards');
return fin({ out });
