const HOME = 'https://staging-crm.taviportal.com/help/hc1.a7a7a7a7000000000000000000000004.rDvrZfW_-TBcbb_XkySGodjzQfiQLj80dsTNfdLteDw/';
const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime|email-preview/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s);
await go('/settings/channels/help-center/rebranding', 14000);
let n0 = NET.length; await page.locator('#help-center-name').fill('NDC Staging'); await sleep(1500);
await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(5000);
out.back = { net: nn(n0), name: arr(D((await api('GET', '/help-centers')).j))[0].name };
// SEO tab
await page.getByRole('button', { name: /^SEO$/ }).first().click().catch(() => page.getByRole('link', { name: /^SEO$/ }).first().click()); await sleep(5000);
const t = (await txt()).replace(/\s+/g, ' '); out.seo = page.url().replace(H, '') + ' :: ' + t.slice(t.indexOf('SEO', t.indexOf('Customers see now') - 2000), t.indexOf('SEO', t.indexOf('Customers see now') - 2000) + 900);
out.seoInp = await page.locator('main input, main textarea').evaluateAll(es => es.map(e => [e.id, e.getAttribute('type'), e.getAttribute('aria-label') || e.getAttribute('placeholder') || '', (e.value || '').slice(0, 40), e.getAttribute('maxlength')].join('|')));
await shot('w4/W4-50-seo');
// Access tab
await page.getByRole('button', { name: /^Access settings$/ }).first().click().catch(() => page.getByRole('link', { name: /^Access settings$/ }).first().click()); await sleep(5000);
const t2 = (await txt()).replace(/\s+/g, ' '); const i2 = t2.indexOf('Access settings', 3000); out.access = page.url().replace(H, '') + ' :: ' + t2.slice(i2, i2 + 900);
await page.getByRole('button', { name: /^User authentication$/ }).first().click().catch(() => page.getByRole('link', { name: /^User authentication$/ }).first().click()); await sleep(5000);
const t3 = (await txt()).replace(/\s+/g, ' '); const i3 = t3.indexOf('User authentication', 3000); out.auth = page.url().replace(H, '') + ' :: ' + t3.slice(i3, i3 + 900);
await shot('w4/W4-50-userauth');
// Arabic portal
const p = await page.context().newPage(); await p.goto(HOME, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
await p.getByRole('link', { name: 'العربية' }).first().click(); await p.waitForTimeout(6000);
out.ar = { dir: await p.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang + '/' + getComputedStyle(document.body).direction), text: (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 300), title: await p.title() };
await p.screenshot({ path: SHOT + '/w4/W4-49-portal-ar.png' });
const back = p.getByRole('link', { name: /English/ }).first(); if (await back.count()) { await back.click(); await p.waitForTimeout(3000); }
await p.close();
return fin({ out });
