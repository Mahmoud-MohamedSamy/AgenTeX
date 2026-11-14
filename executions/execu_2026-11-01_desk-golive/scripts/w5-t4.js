await go('/hq', 9000); const top1 = (await page.locator('header').first().innerText().catch(() => '')).replace(/\s+/g, ' '); out.top1 = top1.slice(0, 200); out.hidden = !/Contracts/.test(top1); await shot('w5/W5-52-hidden');
await go('/settings/organize-tabs', 12000); await page.getByRole('button', { name: 'Show Contracts' }).click(); await sleep(3000);
const g = await api('GET', '/desk/tab-settings'); out.after = JSON.stringify((D(g.j) || {}).arrangement);
await go('/hq', 9000); const top2 = (await page.locator('header').first().innerText().catch(() => '')).replace(/\s+/g, ' '); out.back = /Contracts/.test(top2) || top2.slice(0, 200); await shot('w5/W5-52-back');
return fin({ out });
