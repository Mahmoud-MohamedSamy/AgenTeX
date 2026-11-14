const G = []; const onG = r => { const u = r.url(); if (u.includes('/api/v1/') && /ticket|records|report|view/.test(u)) G.push(r.request().method() + ' ' + u.replace(API, '').slice(0, 220) + ' ' + r.status()); }; page.on('response', onG);
await go('/tickets', 12000); out.tickets = (await mtxt()).slice(0, 400);
await go('/analytics/reports', 10000);
page.off('response', onG); out.G = G.slice(0, 30);
return fin({ out });
