await go('/settings/organize-tabs', 12000);
await page.getByRole('button', { name: 'Hide Contracts' }).click(); await sleep(1000);
let n0 = NET.length; await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000);
out.save1 = NET.slice(n0).filter(x => /tab/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 250));
await go('/hq', 8000); out.topHidden = await page.locator('header, nav').first().innerText().then(t => t.replace(/\s+/g, ' ').slice(0, 200)); out.hasContracts = /Contracts/.test(out.topHidden); await shot('w5/W5-52-hidden');
// agent B view (another user)
await go('/settings/organize-tabs', 12000);
await page.getByRole('button', { name: 'Show Contracts' }).click(); await sleep(1000);
n0 = NET.length; await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000);
out.save2 = NET.slice(n0).filter(x => /tab/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s);
const g = await api('GET', '/desk/tab-settings'); out.after = JSON.stringify((D(g.j) || {}).arrangement);
await go('/hq', 8000); out.topBack = /Contracts/.test(await page.locator('header, nav').first().innerText()); await shot('w5/W5-52-back');
return fin({ out });
