const mods = await api('GET', '/modules'); out.modules = arr(D(mods.j)).map(m => [m.moduleKey, m.labels && m.labels.en, m.id, m.status].join(' | '));
await go('/settings', 10000); out.hub = (await page.locator('body').innerText()).replace(/\n+/g, ' | ').slice(0, 4000);
await shot('w5/probe-settings-hub');
return fin({ out });
