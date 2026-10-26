const ts = arr((await api('GET', '/teamspaces')).j?.data);
const out = { api: ts.map(t => t.name + ' admin=' + JSON.stringify(t.adminUserId || t.admin_user_id || t.adminId || t.admin || null) + ' ' + (t.adminName || t.admin_name || '')) };
const keys = Object.keys(ts[0] || {}); out.keys = keys.join(',');
out.ui = {};
for (const name of ['CRM Teamspace', 'New Teamspace']) {
  await page.goto(H + '/settings/teamspace', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (new RegExp(name).test(await txt().catch(() => ''))) break; } await sleep(800);
  await page.getByText(name, { exact: true }).first().click(); await sleep(3000);
  out.ui[name] = (await txt()).split('Admin')[1]?.split('\n').filter(Boolean).slice(0, 2).join(' ');
  await shot('1700-02-' + name.replace(/ /g, '-'));
}
return done(out);
