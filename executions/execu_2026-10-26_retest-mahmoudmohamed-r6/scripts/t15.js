// NDC-1699: test user 2 (Manager profile, not on the list) vs QA RT TS r6 (profiles User/Supervisor/test).
const id = 'f7082675-ea1b-4220-bfd2-47925ef97570'; const out = {};
const me = (await api('GET', '/iam/me')).j?.data; out.myProfiles = JSON.stringify(me?.profiles_by_app?.crm || me?.profiles || '').slice(0, 120);
out.listed = arr((await api('GET', '/teamspaces')).j?.data).map(t => t.name);
out.open = (await api('GET', `/teamspaces/${id}`)).s; out.folders = (await api('GET', `/teamspaces/${id}/folders`)).s;
await go('/', 15000); const sw = page.getByRole('button', { name: /CRM Teamspace/ }).first();
if (await sw.count()) { await sw.click({ force: true }); await sleep(1500); out.switcher = (await page.locator('[role=menu], [role=listbox], [role=dialog]').last().innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 12); }
await shot('1699-01-manager-switcher'); await page.keyboard.press('Escape');
return done(out);
