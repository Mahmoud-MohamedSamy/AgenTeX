await sleep(20000);
const n = await api('GET', '/notifications?limit=30&category=general&modules=desk&apps=desk'); out.n = (JSON.stringify(D(n.j)).match(/"title":"[^"]{0,120}"/g) || []).filter(t => /QA AC2|R3/.test(t));
out.r3 = st(await probe('R3'));
await go('/views/all/tickets', 6000); await page.getByRole('button', { name: /All Tickets/ }).first().click().catch(() => {}); await sleep(1500);
const f = page.getByText(/Followed|Following/).first(); out.hasView = await f.count(); if (out.hasView) { await f.click(); await sleep(6000); out.followView = [...new Set(((await mtxt()).match(/QA AC2 R\d/g) || []))].join(',') || 'none'; await shot('access/c-followed'); }
return fin({ out });
