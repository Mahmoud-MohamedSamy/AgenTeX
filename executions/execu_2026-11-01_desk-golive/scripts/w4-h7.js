const n0 = NET.length;
await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(5000);
out.net = NET.slice(n0).filter(x => x.m !== 'GET' && !/heartbeat|resolved-batch|realtime|summaries/.test(x.u)).map(x => x.m + ' ' + x.u.split('/').slice(-3).join('/') + ' ' + x.s + ' ' + x.t.slice(0, 200));
out.msg = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts()).join(' / ').slice(0, 300);
const dlP = page.waitForEvent('download', { timeout: 20000 }); await page.getByRole('button', { name: 'Download Arabic translation file' }).click(); const dl = await dlP; await dl.saveAs(RUN + '/wave4/raw/W4-79-customer-happiness.ar.after.json');
const h = D((await api('GET', '/desk/happiness/settings')).j); out.happyOn = h.is_enabled;
return fin({ out });
