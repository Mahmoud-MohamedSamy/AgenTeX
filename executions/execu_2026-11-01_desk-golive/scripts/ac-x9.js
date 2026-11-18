const n = await api('GET', '/notifications?limit=30&category=general&modules=desk&apps=desk'); const L = arr(D(n.j)); out.n = L.filter(x => /4860/.test(JSON.stringify(x))).map(x => JSON.stringify(x).slice(0, 700));
await page.locator('header button[aria-label*="otif" i]').first().click().catch(() => {}); await sleep(3000); await shot('access/c-bell-r3');
return fin({ out });
