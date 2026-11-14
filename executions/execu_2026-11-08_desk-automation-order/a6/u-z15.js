await go('/settings'); await sleep(4000); await page.getByText('Profiles', { exact: true }).first().click(); await sleep(6000); log('url', page.url().replace(H, ''));
log('list', (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(-600));
const adm = page.getByText('Desk Agent', { exact: true }).first(); if (await adm.count()) { await adm.click(); await sleep(6000); }
log('url2', page.url().replace(H, ''));
const b = await text(); log('bp perms', (b.match(/[^\n]{0,80}[Bb]lueprint[^\n]{0,100}/g) || []).slice(0, 12)); await shot('z15-profile');
