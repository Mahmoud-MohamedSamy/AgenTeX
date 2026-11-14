await go('/settings/data/import', 12000);
out.url = page.url();
out.links = await page.locator('a').evaluateAll(es => [...new Set(es.map(e => e.innerText.trim().replace(/\s+/g, ' ') + '=' + e.getAttribute('href')).filter(x => /settings|setup/.test(x)))]);
out.items = await page.locator('nav, aside').last().locator('a, button').evaluateAll(es => es.map(e => (e.innerText || '').trim() + '=' + (e.getAttribute('href') || e.getAttribute('data-href') || '')).slice(0, 120));
return fin({ out });
