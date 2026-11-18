out.full = (await body(page)).match(/.{0,200}annot undo.{0,40}/)?.[0];
await page.getByText('Yes, Merge', { exact: true }).last().click(); await page.waitForTimeout(6000); await shotZ(page, 'merge-done');
for (const id of [T109, T110]) { const t = await api(page, 'GET', 'tickets/' + id); out[id.slice(-3)] = t.s + ' ' + (t.j ? t.j.status + ' #' + t.j.ticketNumber : t.t.slice(0, 100)); }
