// NDC-2399 (user asked 26 Oct to retest): confirm Disconnect, then Connect again.
const d = page.locator('[role=dialog],[role=alertdialog]').last();
await d.getByRole('button', { name: 'Disconnect', exact: true }).click(); const tDis = new Date().toISOString(); await sleep(5000); await shot('2399-r2-02-disconnected');
const btns = await page.locator('button').evaluateAll(b => b.map(x => x.innerText.trim()).filter(t => /connect/i.test(t)));
await page.getByRole('button', { name: /^Connect/ }).first().click(); await sleep(1500); await shot('2399-r2-03-connect-click');
const d2 = page.locator('[role=dialog],[role=alertdialog]'); const dlg2 = (await d2.count()) ? await d2.last().innerText() : 'no dialog';
return done({ tDis, btns, dlg2 });
