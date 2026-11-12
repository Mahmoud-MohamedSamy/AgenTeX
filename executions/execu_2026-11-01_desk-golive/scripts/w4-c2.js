const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 250) + ' => ' + x.t.slice(0, 200));
const HOME = 'https://staging-crm.taviportal.com/help/hc1.a7a7a7a7000000000000000000000004.rDvrZfW_-TBcbb_XkySGodjzQfiQLj80dsTNfdLteDw/';
await go('/settings/channels/community/categories', 12000);
let n0 = NET.length;
out.url = page.url().replace(H, ''); out.cc = await page.getByText('Create category', { exact: true }).evaluateAll(es => es.map(e => e.tagName + ' ' + e.getAttribute('role') + ' ' + e.getAttribute('href'))); await page.getByText('Create category', { exact: true }).first().click(); await sleep(3000);
out.url2 = page.url().replace(H, ''); const d = (await page.locator('[role=dialog]').count()) ? page.locator('[role=dialog]').last() : page.locator('main').last(); out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 700);
out.ctrl = await d.locator('input,textarea,select,button[aria-haspopup],[role=switch]').evaluateAll(es => es.map(e => [e.tagName, e.id, e.getAttribute('type'), e.getAttribute('aria-label') || e.getAttribute('placeholder') || '', (e.innerText || e.value || '').trim().slice(0, 20)].join('|')));
await d.locator('input[type=text], input:not([type])').first().fill('QA GL W4 cat');
const dep = d.locator('button[aria-haspopup]').first(); if (await dep.count()) { await dep.click(); await sleep(1000); await page.getByRole('option', { name: /^Marketing/ }).first().click().catch(() => {}); await page.keyboard.press('Escape'); await sleep(500); }
await d.getByRole('button', { name: /^(Create|Save)/ }).last().click(); await sleep(4000);
out.create = nn(n0); out.msg = (await page.locator('[data-sonner-toast],[role=alert]').allInnerTexts()).join(' / ').slice(0, 200);
const cats = arr(D((await api('GET', '/desk/community/categories')).j)); const mine = cats.find(c => /QA GL W4/.test(c.name)); out.mine = mine ? JSON.stringify(mine).slice(0, 400) : 'none';
if (mine) CREATED.push({ kind: 'community-category', id: mine.id, name: mine.name });
const p = await page.context().browser().newContext().then(c => c.newPage());
await p.goto(HOME + 'community', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); out.portal = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 500);
await p.screenshot({ path: SHOT + '/w4/W4-53-portal-community.png' }); await p.context().close();
return fin({ out });
