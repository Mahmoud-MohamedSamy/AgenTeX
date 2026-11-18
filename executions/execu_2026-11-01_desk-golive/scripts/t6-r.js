await go('/views/all/tickets/' + T1, 9000); NET.length = 0;
await clickItem('Clone'); await sleep(3000);
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(6000);
out.clone = { toast: await toasts(), url: page.url().replace(H, ''), net: flt().filter(x => /POST|PUT/.test(x)).slice(0, 4) }; await shot('tm/tavi-clone-done');
const cl = (await findT('QA GL TM menu 1')).filter(x => x.id !== T1); for (const c of cl) CREATED.push({ kind: 'ticket', id: c.id, name: c.subject }); out.clones = cl.map(c => c.id + ' ' + c.subject + ' #' + c.ticket_number + ' ' + c.status + ' ' + c.email);
await go('/views/all/tickets/' + T1, 9000);
await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; });
const pp = page.context().waitForEvent('page', { timeout: 10000 }).catch(() => null);
await clickItem('Print'); await shot('tm/tavi-print-dlg'); await page.locator('[role=dialog]').last().getByRole('button', { name: 'Print' }).click(); const np = await pp; await sleep(3000);
out.print = { newPage: np ? np.url().replace(H, '') : null, printed: await page.evaluate(() => window.__printed).catch(() => 'n/a'), url: page.url().replace(H, '') };
if (np) { await np.waitForTimeout(3000); out.printText = (await np.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 500); await np.screenshot({ path: SHOT + '/tm/tavi-print.png' }).catch(() => {}); await np.close(); } else { out.printText = (await txt()).replace(/\s+/g, ' ').slice(0, 300); await shot('tm/tavi-print'); }
return fin({ out });
