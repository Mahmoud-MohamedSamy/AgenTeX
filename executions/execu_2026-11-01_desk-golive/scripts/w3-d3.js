const T2 = '53c188f7-9e88-42b3-8d3a-515dfdc31f61';
const r = await get(TM, T2); out.rec = Object.fromEntries(Object.entries(r).filter(([k]) => /archiv|status|updated/i.test(k)));
const h = await api('GET', '/desk/tickets/' + T2 + '/history'); out.hist = h.s + ' ' + JSON.stringify((D(h.j) || []).slice?.(0, 6)).replace(/\s+/g, ' ').slice(0, 1200);
await go('/views/all/tickets/' + T2, 10000); const hb = page.locator('#main-content').getByText('HISTORY', { exact: true }).first(); if (await hb.count()) { await hb.click(); await sleep(3000); out.histUi = ((await mtxt()).match(/HISTORY.{0,900}/) || [''])[0]; await shot('w3/W3-27-history'); }
return fin({ out });
