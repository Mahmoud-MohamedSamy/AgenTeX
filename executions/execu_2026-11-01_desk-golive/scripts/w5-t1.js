const G = []; const onG = async r => { const u = r.url(); if (u.includes('/api/v1/') && /tab|organi|navigation|home/i.test(u)) { let t = ''; try { t = await r.text(); } catch (e) {} G.push(r.request().method() + ' ' + u.replace(API, '') + ' ' + r.status() + ' ' + t.slice(0, 600)); } }; page.on('response', onG);
await go('/settings/organize-tabs', 12000);
out.ui = await page.locator('main').last().getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)).filter(Boolean).slice(-20));
page.off('response', onG); out.G = G; await shot('w5/W5-52-before');
return fin({ out });
