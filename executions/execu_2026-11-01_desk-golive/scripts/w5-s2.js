await go('/settings/data/import', 12000);
const all = await page.locator('button, a, [role=treeitem], [role=link]').evaluateAll(es => es.map(e => (e.innerText || '').trim()).filter(x => x && x.length < 40));
out.menu = [...new Set(all)].join(' | ').slice(0, 3000);
const body = async () => { const h = page.locator('main h1, main h2').filter({ hasNotText: /^(GENERAL|USER MANAGEMENT)$/ }); const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const cut = t.lastIndexOf('Custom Actions'); return t.slice(cut > 0 ? cut + 14 : 0, (cut > 0 ? cut : 0) + 700); };
out.importBody = await body();
return fin({ out });
