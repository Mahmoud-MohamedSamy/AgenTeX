await go('/team-feeds/' + MK + '/all', 10000);
const box = page.getByText(/^Share an update with Marketing/).first();
out.html = await box.evaluate(e => e.parentElement.parentElement.outerHTML.slice(0, 800));
await box.click(); await sleep(2000);
out.ce = await page.locator('[contenteditable=true], textarea').evaluateAll(es => es.map(e => e.tagName + ' ' + (e.getAttribute('aria-label') || e.getAttribute('placeholder') || '')));
out.dlg = (await dtxt()).slice(0, 300);
await shot('w5/W5-32-composer');
return fin({ out });
