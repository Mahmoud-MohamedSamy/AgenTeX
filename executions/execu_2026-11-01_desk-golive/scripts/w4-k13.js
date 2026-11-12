const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 250) + ' => ' + x.t.slice(0, 200));
const ART = '0f683d99-2d89-4846-ae0a-ed741692cc83';
await go('/knowledge-base/articles/' + ART, 12000);
await page.locator('main button').filter({ hasText: /^Translations$/ }).first().click(); await sleep(2500);
await page.locator('main button').filter({ hasText: /^Arabic/ }).first().click(); await sleep(4000);
const all = (await page.locator('main button').allInnerTexts()).map(s => s.trim()).filter(Boolean); out.btns = all.slice(all.findIndex(s => /^Arabic/.test(s)));
out.panel = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').split('Turkish').slice(-1)[0].slice(0, 600);
const body = page.locator('[aria-label=Body]').first();
const tIn = body.locator('xpath=preceding::input[not(@type) or @type="text"][1]');
// fill title (input before Body) and body
const anchor = page.getByText(/^Arabic · /).last(); const inputs = anchor.locator("xpath=following::input[not(@type) or @type='text']"); const n = await inputs.count(); out.nIn = n;
await inputs.nth(0).fill('QA GL W4 مقال مترجم').catch(e => out.tErr = e.message.slice(0, 80));
await body.click(); await page.keyboard.type('هذه الترجمة العربية لمقال الاختبار. كلمة البحث: فهد٤٤');
await sleep(800);
const n0 = NET.length;
const pub = page.getByRole('button', { name: 'Save translation' }).last(); out.pubDis = await pub.isDisabled().catch(() => '?'); out.titleVal = await inputs.nth(0).inputValue().catch(() => '?');
await pub.click({ timeout: 8000 }).catch(e => out.pErr = e.message.slice(0, 80)); await sleep(5000);
const d = page.locator('[role=dialog]').last(); if (await d.count()) { out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 200); await d.getByRole('button', { name: /^(Publish|Save|Confirm)/ }).last().click().catch(() => {}); await sleep(4000); }
out.net = nn(n0); out.msg = (await page.locator('[data-sonner-toast],[role=alert]').allInnerTexts()).join(' / ').slice(0, 200);
await shot('w4/W4-69-translated');
return fin({ out });
