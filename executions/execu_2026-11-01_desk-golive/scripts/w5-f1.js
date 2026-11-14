const G = []; const onG = r => { const u = r.url(); if (u.includes('/api/v1/') && /feed|social|post|stream/i.test(u)) G.push(r.request().method() + ' ' + u.replace(API, '').slice(0, 140) + ' ' + r.status()); }; page.on('response', onG);
for (const u of ['/feeds', '/desk/feeds', '/team-feeds', '/collaboration']) { await go(u, 7000); out[u] = page.url().replace(H, '') + ' | ' + (await mtxt()).slice(0, 200); }
const nav = await page.locator('nav a, header a, [role=menuitem]').evaluateAll(es => es.map(e => (e.innerText || e.getAttribute('aria-label') || '').trim() + '=' + e.getAttribute('href')).filter(x => /feed|social|collab/i.test(x))); out.nav = nav;
await page.getByRole('button', { name: 'Open app switcher' }).click().catch(() => {}); await sleep(1500); out.apps = (await page.locator('[role=dialog], [role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await page.keyboard.press('Escape');
page.off('response', onG); out.G = G;
return fin({ out });
