await openT(page, T108);
await more(page, 'Edit'); await page.waitForTimeout(6000); out.editUrl = page.url().slice(-60);
out.edit = (await body(page)).slice(0, 500); out.layoutCtl = (await body(page)).match(/.{0,60}[Ll]ayout.{0,80}/g)?.slice(0, 3); await shotZ(page, 'edit-form');
