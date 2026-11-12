const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 200) + ' => ' + x.t.slice(0, 200));
const ART = '0f683d99-2d89-4846-ae0a-ed741692cc83';
await go('/knowledge-base/articles/' + ART, 12000);
const tab = async n => { await page.locator('main button').filter({ hasText: new RegExp('^' + n + '$') }).first().click(); await sleep(3000); return (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').split('Translations').slice(1).join(' | ').slice(0, 700); };
out.trans = await tab('Translations');
out.transBtns = (await page.locator('main button').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(-8);
out.vers = await tab('Versions');
await shot('w4/W4-70-versions');
return fin({ out });
