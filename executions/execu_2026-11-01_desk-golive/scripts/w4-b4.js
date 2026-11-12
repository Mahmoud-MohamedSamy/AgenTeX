const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 120) + ' => ' + x.t.slice(0, 160));
const ID = 'a42174d4-fa09-4a2b-bb6d-b1dbd102da1c';
await go('/knowledge-base/articles/' + ID, 12000);
await page.locator('main button').filter({ hasText: /^Review$/ }).first().click(); await sleep(3500);
out.after = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').split('Translations').slice(1).join(' | ').slice(0, 900);
out.btns = (await page.locator('main button').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(-14);
await shot('w4/W4-62-review-tab');
const n0 = NET.length;
const ap = page.getByRole('button', { name: /^Approve/ }).first();
if (await ap.count()) { await ap.click(); await sleep(2500); const d = page.locator('[role=dialog]').last(); if (await d.count()) { out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); await d.getByRole('button', { name: /^(Approve|Publish|Confirm)/ }).last().click().catch(() => {}); await sleep(4000); } }
out.net = nn(n0);
const a = D((await api('GET', '/desk/kb/articles/' + ID)).j); out.state = a && (a.status + ' published_at=' + a.published_at);
return fin({ out });
