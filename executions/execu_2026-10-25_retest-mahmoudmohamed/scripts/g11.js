await page.getByRole('button', { name: 'Cancel', exact: true }).first().click(); await sleep(1500);
const d = page.getByRole('alertdialog').or(page.getByRole('dialog')).first();
let dlg = null; if (await d.count()) { dlg = (await d.innerText()).slice(0, 200); const b = d.getByRole('button', { name: /Discard|Leave|Yes|Don't save/i }).first(); if (await b.count()) await b.click(); await sleep(1500); }
return done({ dlg, url: page.url().replace(H, '') });
