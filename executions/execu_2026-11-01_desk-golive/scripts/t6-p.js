await go('/views/all/tickets/' + T2, 9000);
out.followBtns = await page.locator('button,[role=menuitem]').evaluateAll(es => es.filter(e => /follow/i.test((e.innerText || '') + ' ' + (e.getAttribute('aria-label') || '') + ' ' + (e.getAttribute('title') || ''))).map(e => (e.innerText || '').trim() + ' | ' + e.getAttribute('aria-label') + ' | ' + e.getAttribute('title')));
const scripts = await page.evaluate(() => [...document.scripts].map(s => s.src).filter(Boolean).slice(0, 5)); out.bundle = scripts;
return fin({ out });
