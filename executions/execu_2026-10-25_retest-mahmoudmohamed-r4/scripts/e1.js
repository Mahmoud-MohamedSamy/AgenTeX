// NDC-1602: open the Empty Bin dialog only and read it.
await shot('1602-r2-01-bin-before');
await page.getByText('Empty Bin', { exact: true }).first().click(); await sleep(1500); await shot('1602-r2-02-dialog');
const d = page.locator('[role=dialog],[role=alertdialog]').last();
return done({ dlg: await d.innerText().catch(() => 'no dialog'), btns: await d.locator('button').evaluateAll(b => b.map(x => x.innerText.trim())).catch(() => []) });
