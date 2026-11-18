const G = []; const og = r => { const u = r.url(); if (r.request().method() === 'GET' && /layout/i.test(u)) G.push(r.status() + ' ' + u.replace(API, '').slice(0, 160)); }; page.on('response', og);
await go('/views/all/tickets/' + TK.R5, 10000); out.G = [...new Set(G)]; page.off('response', og);
out.props = (await page.locator('aside').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600);
await clickItem('Change Layout').catch(e => out.e = String(e.message).slice(0, 60)); await sleep(1500); out.cl = await dlg(); await shot('access/c-r5-layout'); await page.keyboard.press('Escape');
return fin({ out });
