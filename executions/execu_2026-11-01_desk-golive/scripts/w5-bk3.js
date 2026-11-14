const g = await api('GET', '/desk/data/backups/01a1d24e-0087-72c7-842e-be6ceb09ce13'); out.b = g.s + ' ' + g.t.slice(0, 400);
await go('/settings/data/backup', 12000); const t = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
out.list = t.slice(t.indexOf('Back Up Now'), t.indexOf('Back Up Now') + 200); out.logs = t.slice(t.indexOf('Backup logs'), t.indexOf('Backup logs') + 400);
const i = t.search(/Your backups|Backups \(/); out.mine = i > 0 ? t.slice(i, i + 500) : 'no list section';
await shot('w5/W5-41-after');
return fin({ out });
