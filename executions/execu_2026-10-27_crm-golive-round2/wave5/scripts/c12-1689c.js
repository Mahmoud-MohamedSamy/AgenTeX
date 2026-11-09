const res = {};
const net = []; const on = r => { if (/\/api\/v1\//.test(r.url()) && r.request().method() !== 'GET') net.push(r.request().method() + ' ' + r.url().replace(/^.*\/api\/v1/, '') + ' ' + r.status()); }; page.on('response', on);
await page.mouse.click(963, 150); await sleep(1800);
await shot('c12-1689-confirm');
res.afterClick = (await page.innerText('body')).replace(/\s+/g, ' ').match(/(Delete [^.]{0,220}|Are you sure[^.]{0,200}|Remove[^.]{0,150})/g)?.slice(0, 3) || 'nothing';
const c = page.locator('button', { hasText: /^(Delete|Confirm|Yes|Delete Teamspace|Delete teamspace)$/ });
res.confirmButtons = await c.count();
if (res.confirmButtons) { await c.last().click(); await sleep(3000); }
page.off('response', on); res.net = net;
res.url = page.url().replace(H, '');
res.teamspaces = (await call('GET', '/teamspaces')).j.data.map(t => t.name);
await shot('c12-1689-after');
return res;
