const N = []; const on = r => { const q = r.request(); if (q.method() !== 'GET' && /supportapi|api\/v1/.test(r.url())) N.push(q.method() + ' ' + r.status() + ' ' + r.url().replace(/^.*?(api\/v1\/|supportapi\/)/, '') + ' ' + (q.postData() || '').slice(0, 300)); }; page.on('response', on);
await openT(page, '1499272000000451643'); const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {});
await more(page, 'Share');
out.dlg = (await body(page)).match(/Share Ticket.{0,600}/)?.[0]; await shotZ(page, 'ac-share-dialog');
page.off('response', on); out.N = N;
