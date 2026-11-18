await openT(page, '1499272000000451889'); const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {});
await shotZ(page, 'ac-col-before'); out.snaps = [];
for (let i = 0; i < 6; i++) { await page.waitForTimeout(10000); out.snaps.push((await body(page)).replace(/\s+/g, ' ').match(/.{0,80}(moved|Moved|another department|follow|Follow|no longer|not authorized|permission).{0,160}/)?.[0] || '-'); }
await shotZ(page, 'ac-col-after');
