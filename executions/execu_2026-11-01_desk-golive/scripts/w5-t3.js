const g = await api('GET', '/desk/tab-settings'); out.now = JSON.stringify((D(g.j) || {}).arrangement);
out.btns = await page.getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 30)).filter(x => /save|apply|discard|reset|cancel|show con|hide con/i.test(x)));
out.net = NET.map(x => x.m + ' ' + x.u + ' ' + x.s).filter(x => /tab/.test(x)); await shot('w5/W5-52-state');
return fin({ out });
