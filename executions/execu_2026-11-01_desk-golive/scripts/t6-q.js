await go('/views/all/tickets/' + T2, 9000); NET.length = 0; await clickItem('Unarchive'); await sleep(1500); out.unarch = { dlg: await dlg(), toast: await toasts(), net: flt() };
await go('/views/all/tickets/' + T1, 9000); NET.length = 0;
await clickItem('Clone'); await sleep(2500); out.cloneDlg = await dlg(); out.cloneUrl = page.url().replace(H, ''); await shot('tm/tavi-clone-1');
const sv = page.getByRole('button', { name: /^(Save|Create|Submit)/ }).first(); if (await sv.count()) { await sv.click(); await sleep(5000); }
out.clone = { toast: await toasts(), url: page.url().replace(H, ''), net: flt().filter(x => /POST|PUT/.test(x)).slice(0, 4) }; await shot('tm/tavi-clone-done');
const cl = (await findT('QA GL TM menu 1')).filter(x => x.id !== T1); for (const c of cl) CREATED.push({ kind: 'ticket', id: c.id, name: c.subject }); out.clones = cl.map(c => c.subject + ' #' + c.ticket_number + ' ' + c.status + ' dept ' + String(c.department).slice(0, 8));
await go('/views/all/tickets/' + T1, 9000);
const pp = page.context().waitForEvent('page', { timeout: 8000 }).catch(() => null); await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; });
await clickItem('Print'); const np = await pp; await sleep(2500);
out.print = { newPage: np ? np.url().replace(H, '') : null, dlg: await dlg(), printed: await page.evaluate(() => window.__printed), url: page.url().replace(H, '') };
if (np) { await np.waitForTimeout(3000); out.printText = (await np.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await np.screenshot({ path: SHOT + '/tm/tavi-print.png' }).catch(() => {}); await np.close(); } else await shot('tm/tavi-print');
return fin({ out });
