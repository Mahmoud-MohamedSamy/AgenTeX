const res = [];
for (const [tid, lay] of [[T1, 'Test Layout Rules'], [T2, 'Test Layout Rules'], [T2, 'QA NDC ADM']]) {
  await go('/views/all/tickets/' + tid, 9000); NET.length = 0; await clickItem('Change Layout'); const d = page.locator('[role=dialog]').last();
  await d.getByText(lay, { exact: true }).first().click(); await sleep(600); await d.getByRole('button', { name: 'Change layout' }).click(); await sleep(5000);
  res.push({ tid: tid.slice(0, 8), lay, dlg: (await dlg()).slice(-160), toast: await toasts(), net: flt() }); await shot('tm/tavi-layout-' + tid.slice(0, 4) + '-' + lay.replace(/\s+/g, ''));
  await page.keyboard.press('Escape'); await sleep(20000);
}
out.res = res; out.ping = (await api('GET', '/modules/' + TM + '/records/' + T1)).s;
return fin({ out });
