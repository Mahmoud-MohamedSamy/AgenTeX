const G = []; const og = r => { const u = r.url(); if (r.request().method() === 'GET' && u.includes('/api/v1/') && /contact|ticket|record/i.test(u) && !/notif/.test(u)) G.push(r.status() + ' ' + u.replace(API, '').slice(0, 150)); }; page.on('response', og);
await go('/modules/' + CM + '/records/' + CON2, 10000); out.ui1 = (await mtxt()).slice(0, 300);
const tab = page.getByRole('tab', { name: /Tickets/ }).first(); if (await tab.count()) { await tab.click(); await sleep(5000); }
out.ui = [...new Set(((await mtxt()).match(/QA AC2 R\d/g) || []))].join(','); out.uiTxt = (await mtxt()).slice(0, 900); await shot('access/c-contact2');
page.off('response', og); out.G = [...new Set(G)].slice(0, 15);
out.follow = await prr('PUT', '/desk/tickets/' + TK.R3 + '/follow', {});
return fin({ out });
