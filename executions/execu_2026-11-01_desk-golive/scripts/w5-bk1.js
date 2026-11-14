await go('/settings/data/backup', 12000);
const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); out.page = t.slice(t.indexOf('Data Backup Back up') , t.indexOf('Data Backup Back up') + 2000);
out.ctl = await page.locator('main').last().locator('button, input, [role=radio], [role=checkbox]').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText || e.value || '').trim().slice(0, 30)).slice(-25));
await shot('w5/W5-41-backup');
return fin({ out });
