// Step 0 — read-only baseline (GET only).
const B = { takenAt: new Date().toISOString() };
const mods = await api('GET', '/modules'); B.modules = mods.j;
B.perModule = {};
for (const m of arr(mods.j.data)) {
  const o = {};
  for (const k of ['', '/fields', '/layouts', '/layout-rules', '/validation-rules', '/dependency-maps', '/field-permissions', '/related-modules', '/links', '/buttons']) { const r = await api('GET', `/modules/${m.id}${k}`); o[k || 'module'] = r.j; }
  B.perModule[m.moduleKey] = o;
}
for (const [k, p] of [['datatypes', '/fields/datatypes'], ['customDatatypes', '/custom-datatypes'], ['teamspaces', '/teamspaces'], ['profiles', '/iam/profiles'], ['users', '/iam/users?page_size=200'], ['departments', '/desk/departments']]) B[k] = (await api('GET', p)).j;
// my tab arrangement: watch the Organize Tabs page load
const seen = [];
const onResp = async r => { const u = r.url(); if (u.includes('/api/v1/') && r.request().method() === 'GET' && /pref|setting|tab/i.test(u)) { try { seen.push({ url: u.replace(API, ''), status: r.status(), body: (await r.text()).slice(0, 4000) }); } catch (e) { } } };
page.on('response', onResp);
await go('/settings/organize-tabs', 7000);
page.off('response', onResp);
B.tabPrefCalls = seen;
B.organizeTabsText = (await txt()).split('Organize Tabs').slice(-1)[0].slice(0, 600);
page.off('request', onReq);
return JSON.stringify(B);
