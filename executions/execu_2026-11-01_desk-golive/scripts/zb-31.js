await page.getByText('Cancel', { exact: true }).filter({ visible: true }).last().click().catch(() => {}); await page.waitForTimeout(2000);
await openT(page, T108);
await more(page, 'Delete'); await page.waitForTimeout(2500); out.delDlg = (await body(page)).match(/.{0,30}[Dd]elete.{0,350}/g)?.slice(-1)[0]; await shotZ(page, 'delete-dlg');
