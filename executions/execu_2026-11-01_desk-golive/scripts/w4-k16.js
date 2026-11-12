const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 150) + ' => ' + x.t.slice(0, 200));
const ART = '0f683d99-2d89-4846-ae0a-ed741692cc83';
const cur = D((await api('GET', '/desk/kb/articles/' + ART)).j);
out.draftNow = cur.draft ? 'has draft' : 'no draft';
for (const v of ['v2', 'v3']) { const r = await api('PUT', '/desk/kb/articles/' + ART, { title: 'QA GL W4 article', body_html: '<p>QA GL W4 article ' + v + '. Search word: zebrafish42.</p>', summary: null, category_id: cur.category_id, visibility: cur.visibility }); const p = await api('POST', '/desk/kb/articles/' + ART + '/publish', {}); out[v] = r.s + '/' + p.s + ' ' + (r.s >= 400 ? r.t.slice(0, 200) : '') + (p.s >= 400 ? p.t.slice(0, 200) : ''); }
await go('/knowledge-base/articles/' + ART, 12000);
await page.locator('main button').filter({ hasText: /^Versions$/ }).first().click(); await sleep(3000);
out.versions = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').split('Translations').slice(1).join(' | ').slice(0, 600);
const n0 = NET.length;
const rs = page.getByRole('button', { name: /^Restore/ }); out.nRestore = await rs.count();
if (out.nRestore) { await rs.last().click(); await sleep(2500); const d = page.locator('[role=dialog],[role=alertdialog]').last(); if (await d.count()) { out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); await d.getByRole('button', { name: /^Restore/ }).last().click().catch(() => {}); await sleep(4000); } }
out.restoreNet = nn(n0);
const a = D((await api('GET', '/desk/kb/articles/' + ART)).j); out.after = a.status + ' | ' + a.body_html.slice(0, 120) + ' | draft=' + (a.draft ? String(a.draft.body_html || '').slice(0, 120) : 'none');
await shot('w4/W4-70-restored');
return fin({ out });
