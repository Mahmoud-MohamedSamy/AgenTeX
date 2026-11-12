const HOME = 'https://staging-crm.taviportal.com/help/hc1.a7a7a7a7000000000000000000000004.rDvrZfW_-TBcbb_XkySGodjzQfiQLj80dsTNfdLteDw/';
const main = async () => (await page.locator('main').last().innerText()).replace(/\s+/g, ' ');
await go('/settings/channels/help-center/seo', 14000); out.seoTitle = await page.locator('main input').nth(0).inputValue().catch(() => '?'); out.seoInputs = await page.locator('main input,main textarea').evaluateAll(es => es.map(e => (e.value || '').slice(0, 40)));
await go('/settings/channels/help-center/access', 14000); out.access = (await main()).slice(0, 1500);
await go('/settings/channels/help-center/authentication', 14000); out.auth = (await main()).slice(0, 1200); await shot('w4/W4-50-userauth');
const p = await page.context().newPage(); await p.goto(HOME, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
out.arEl = await p.getByText('العربية', { exact: true }).evaluateAll(es => es.map(e => e.tagName + ' ' + e.getAttribute('role') + ' ' + e.getAttribute('href')));
await p.getByText('العربية', { exact: true }).first().click(); await p.waitForTimeout(7000);
out.ar = { dir: await p.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang + '/' + getComputedStyle(document.body).direction), text: (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 300), title: await p.title(), url: p.url().replace(/hc1\.[\w.-]+/, 'HC') };
await p.screenshot({ path: SHOT + '/w4/W4-49-portal-ar.png' });
const en = p.getByText('English', { exact: true }).first(); if (await en.count()) { await en.click(); await p.waitForTimeout(3000); }
await p.close();
return fin({ out });
