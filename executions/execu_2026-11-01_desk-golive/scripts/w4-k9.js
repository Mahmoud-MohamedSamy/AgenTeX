const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 120) + ' => ' + x.t.slice(0, 200));
const ID = 'a42174d4-fa09-4a2b-bb6d-b1dbd102da1c';
await go('/knowledge-base/articles/' + ID, 12000); if (!(await page.getByRole('button', { name: /More save options/ }).count())) { const e = page.getByRole('button', { name: /^Edit/ }).first(); if (await e.count()) { await e.click(); await sleep(4000); } } out.url = page.url().replace(H, '');
out.btns = (await page.locator('main button').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 14); out.ptext = (await page.locator('main').last().innerText()).replace(/s+/g, ' ').slice(0, 300);
const more = page.getByRole('button', { name: /More save options/ }).first(); if (await more.count()) { await more.click(); await sleep(1200); out.menu = await page.locator('[role=menuitem],[role=option]').allInnerTexts(); }
const n0 = NET.length;
const sfr = page.getByRole('menuitem', { name: /review/i }).first(); if (await sfr.count()) { await sfr.click(); await sleep(3000); const d = page.locator('[role=dialog]').last(); if (await d.count()) { out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); await d.getByRole('button', { name: /send|submit|request/i }).last().click().catch(() => {}); await sleep(3000); } }
else { const b = page.getByRole('button', { name: /review/i }).first(); if (await b.count()) { out.btnReview = await b.innerText(); await b.click(); await sleep(4000); } }
out.net = nn(n0); out.msg = (await page.locator('[data-sonner-toast],[role=alert]').allInnerTexts()).join(' / ').slice(0, 200);
const a = D((await api('GET', '/desk/kb/articles/' + ID)).j); out.state = a.status + ' review_requested_at=' + a.review_requested_at;
return fin({ out });
