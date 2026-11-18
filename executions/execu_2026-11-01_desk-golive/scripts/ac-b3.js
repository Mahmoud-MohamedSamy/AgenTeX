for (const k of ['MV3', 'SH1', 'MK2']) { const h = D((await api('GET', '/desk/tickets/' + TK[k] + '/history')).j); const L = Array.isArray(h) ? h : (h && (h.items || h.entries)) || []; out[k] = L.map(e => e.action || e.type || e.event).join(','); }
await go('/views/all/tickets/' + TK.SH1, 9000); await page.getByRole('tab', { name: /History/ }).first().click().catch(() => {}); await sleep(4000); out.ui = (await mtxt()).slice(0, 1500); await shot('access/b-sh1-history');
return fin({ out });
