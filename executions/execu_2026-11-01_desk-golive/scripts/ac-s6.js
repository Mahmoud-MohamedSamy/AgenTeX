const G = []; const og = r => { const u = r.url(); if (u.includes('/api/v1/') && !/iam\/auth|token|notif|mass-/.test(u)) G.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(API, '').slice(0, 150)); }; page.on('response', og);
await go('/settings/users-control/profiles', 9000);
const row = page.locator('li,tr,div[role=treeitem]', { hasText: 'Desk Supervisor' }).last();
out.btns = await row.locator('button').evaluateAll(es => es.map(e => ((e.getAttribute('aria-label') || '') + '|' + e.innerText).trim().slice(0, 60)));
const ab = row.locator('button[aria-label*="ssign"], button[title*="ssign"]'); out.n = await ab.count();
if (out.n) { G.length = 0; await ab.first().click(); await sleep(3000); out.dlg = await dlg(); out.G = G.slice(0, 10); }
await shot('s6-prof');
page.off('response', og);
return fin({ out });
