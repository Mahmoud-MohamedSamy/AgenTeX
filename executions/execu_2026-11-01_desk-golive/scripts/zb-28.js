await page.waitForTimeout(8000); out.page = (await body(page)).slice(0, 500); await shotZ(page, 'merge-done');
for (const id of [T109, T110]) { const t = await api(page, 'GET', 'tickets/' + id); out[id.slice(-3)] = t.s + ' ' + (t.j ? t.j.status + ' #' + t.j.ticketNumber : t.t.slice(0, 100)); }
