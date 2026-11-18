await page.locator('li').filter({ hasText: 'Not Spam' }).first().click(); await page.waitForTimeout(4000);
out.dlg = (await body(page)).slice(-300); await shotZ(page, 'notspam');
const ok = page.locator('input[type=button],button').filter({ hasText: /Not Spam|Yes|OK/ }); out.btns = await ok.count();
const t = await api(page, 'GET', 'tickets/' + T109); out.isSpam = t.j && t.j.isSpam;
