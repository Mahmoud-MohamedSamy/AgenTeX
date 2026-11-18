const r = await api('GET', '/modules/' + TM + '/records?limit=5&q=4342'); const t = arr(D(r.j)).map(flat).find(x => String(x.ticket_number) === '4342'); out.t = JSON.stringify(t).slice(0, 500);
if (t) { await go('/views/all/tickets/' + t.id, 9000); const m = await openMore(); out.menu4342 = await m.getByRole('menuitem').allInnerTexts(); await page.keyboard.press('Escape'); await shot('tm/tavi-4342-menu'); }
await go('/views/all/tickets/' + T1, 9000); let m = await openMore(); out.menuT1 = await m.getByRole('menuitem').allInnerTexts(); await page.keyboard.press('Escape');
out.hdr = (await page.locator('main').first().innerText()).replace(/\s+/g, ' ').slice(0, 300);
return fin({ out });
