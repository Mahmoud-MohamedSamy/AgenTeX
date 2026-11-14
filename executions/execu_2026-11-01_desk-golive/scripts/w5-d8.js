await go('/analytics/dashboards/builder', 12000);
out.main = (await mtxt()).slice(0, 900);
out.ctl = await page.locator('main').locator('button, input, textarea').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText || e.placeholder || '').trim().slice(0, 40)).filter(x => x.length > 7));
await shot('w5/W5-30-builder');
return fin({ out });
