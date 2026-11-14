await go('/modules/88e8ea44-1658-4df3-9930-d0902b91073d', 12000);
out.url = page.url().replace(H, ''); out.top = (await mtxt()).slice(0, 300);
out.ctl = await page.locator('main input, main button').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.placeholder || e.innerText || '').trim().slice(0, 30)).slice(0, 40));
return fin({ out });
