await go('/modules/' + CM, 8000);
await page.getByRole('button', { name: /Find duplicates/i }).first().click(); await sleep(5000);
const dlg = page.locator('[role=dialog]').last();
await dlg.getByText('Email', { exact: true }).click().catch(() => {}); await sleep(3000); out.byEmail = (await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 300);
await dlg.getByText('Name', { exact: true }).click().catch(() => {}); await sleep(3000);
const mb = dlg.getByRole('button', { name: 'Merge' }); const nmb = await mb.count(); let hit = -1; for (let i = 0; i < nmb; i++) { const t = await mb.nth(i).evaluate(b => { let e = b; for (let k = 0; k < 5; k++) { e = e.parentElement; if (/@|qa gl|mahmoud/i.test(e.innerText)) return e.innerText; } return ''; }); if (/qa gl w5 dup/i.test(t) && !/mahmoud/i.test(t)) { hit = i; break; } } out.hit = hit; if (hit < 0) return fin({ out }); await mb.nth(hit).click(); await sleep(4000);
const m = page.locator('[role=dialog]').last(); out.mergeDlg = (await m.innerText()).replace(/\s+/g, ' ').slice(0, 700); await shot('w5/W5-05-merge-dialog');
const n0 = NET.length;
const btn = m.getByRole('button', { name: /^Merge/ }).last(); out.btnDis = await btn.isDisabled().catch(() => '?');
await btn.click().catch(e => out.mErr = e.message.slice(0, 80)); await sleep(5000);
const c = page.locator('[role=alertdialog],[role=dialog]').last(); if (await c.count() && /sure|confirm|cannot be undone/i.test(await c.innerText().catch(() => ''))) { out.confirm = (await c.innerText()).replace(/\s+/g, ' ').slice(0, 200); await c.getByRole('button', { name: /Merge|Confirm|Yes/ }).last().click().catch(() => {}); await sleep(5000); }
out.net = NET.slice(n0).filter(x => x.m !== 'GET' && !/heartbeat|resolved|realtime|summaries/.test(x.u)).map(x => x.m + ' ' + x.u.split('/').slice(-3).join('/') + ' ' + x.s + ' ' + x.t.slice(0, 160));
out.msg = (await page.locator('[data-sonner-toast]').allInnerTexts()).join(' / ').slice(0, 200);
await shot('w5/W5-05-merged');
const a = await api('GET', '/modules/' + CM + '/records/9d2434da-e5e7-4eb0-a79d-0de77d3c1bcc'); const b = await api('GET', '/modules/' + CM + '/records/d8c3be5b-14a1-4980-841b-ce64d4845a2a'); out.after = [a.s, b.s];
return fin({ out });
