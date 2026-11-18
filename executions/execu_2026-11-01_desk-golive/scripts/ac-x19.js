await sleep(20000);
const G = []; const og = r => { const u = r.url(); if (u.includes('/api/v1/') && /export|job|data/i.test(u) && !/sandbox/.test(u)) G.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(API, '').slice(0, 160)); }; page.on('response', og);
await go('/settings/data/export', 9000); page.off('response', og); out.G = [...new Set(G)];
const hist = (await mtxt()).match(/Export history.{0,700}/)?.[0]; out.hist = hist;
return fin({ out });
