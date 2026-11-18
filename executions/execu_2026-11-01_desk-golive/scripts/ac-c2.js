const NEW = '5ca754d7-0a49-41b7-96b1-164d225ff063';
const g = await api('GET', '/modules/' + TM + '/records/' + NEW); out.cSeesNew = g.s; if (g.s === 200) { const f = flat(D(g.j)); out.newRec = [f.department, f.owner, f.ticket_number].join(' | '); }
const gs = await api('GET', '/search?q=' + encodeURIComponent('QA AC MK1 access run')); const hits = JSON.stringify(gs.j); out.gsHasMK1 = hits.includes(TK.MK1); out.gsHasAny = Object.entries(TK).filter(([k, v]) => hits.includes(v)).map(([k]) => k).join(',');
const gs2 = await api('GET', '/search?q=' + encodeURIComponent('QA AC')); const h2 = JSON.stringify(gs2.j); out.gs2 = Object.entries(TK).filter(([k, v]) => h2.includes(v)).map(([k]) => k).join(',');
await go('/views/all/tickets', 8000);
await page.locator('header button').filter({ has: page.locator('svg') }).nth(0).click().catch(() => {});
const btn = page.getByRole('button', { name: /^Create|^New/i }); out.nb = await btn.count();
const plus = page.locator('button[aria-label*="Create" i], button[aria-label*="New" i], button[aria-label*="Quick" i]'); out.plusLabels = await plus.evaluateAll(es => es.map(e => e.getAttribute('aria-label')));
await plus.first().click().catch(() => {}); await sleep(2000); out.menu = (await page.locator('[role=menu],[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' | ').slice(0, 400);
await page.getByRole('menuitem', { name: /^Ticket/ }).first().click().catch(() => {}); await sleep(5000); out.url = page.url(); out.form = (await dlg()) || (await mtxt()).slice(0, 500);
await shot('access/c-create');
return fin({ out });
