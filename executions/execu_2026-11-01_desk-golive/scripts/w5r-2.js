// W5-55 layouts default status
const L = await api('GET', '/modules/' + TM + '/layouts'); const ls = arr(D(L.j)); out.layouts = ls.map(l => { const s = JSON.stringify(l); const m = s.match(/"(default_status|default_value|defaultValue)":("[^"]*"|null|\{[^}]*\})/g); return [l.id && l.id.slice(0, 8), l.name, l.department_id || (l.departments || []).join(','), (m || []).slice(0, 4).join(' ')].join(' | '); }).slice(0, 12);
const sf = arr(D((await api('GET', '/modules/' + TM + '/fields?limit=300')).j)).find(f => (f.api_name || f.name) === 'status'); out.statusField = sf && JSON.stringify({ def: sf.default_value, opts: (sf.options || sf.picklist_values || []).length }).slice(0, 200);
// W5-21 NDC-2635 items
const act = await api('GET', '/activities?limit=3'); out.actApi = act.s + ' ' + act.t.slice(0, 150);
for (const p of ['/desk/activities?limit=3', '/activities/tasks?limit=3', '/desk/tasks?limit=3']) { const r = await api('GET', p); out['api ' + p] = r.s; }
await go('/activities', 10000); out.actPage = (await mtxt()).slice(0, 400);
const firstRow = page.locator('main tr, main [role=row]').nth(1); if (await firstRow.count()) { await firstRow.click().catch(() => {}); await sleep(5000); out.actDetailUrl = page.url().replace(H, ''); out.actBtns = await page.locator('main').getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 30)).filter(Boolean).slice(0, 40)); const mb = page.locator('main').getByRole('button', { name: /^(More|More actions|Actions)$/i }).first(); if (await mb.count()) { await mb.click(); await sleep(1000); out.actMenu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await page.keyboard.press('Escape'); } await shot('w5r/W5-21-activity-page'); }
// W5-73 agent C profile
const us = arr(D((await api('GET', '/iam/users?limit=200')).j)); const c = us.find(u => /^fedelav803@/.test(u.email || ''));
out.cProfiles = c && JSON.stringify(c.profiles_by_app || c.profiles || c.profile_id).slice(0, 300);
const pid = c && ((c.profiles_by_app && (c.profiles_by_app.desk || {}).id) || (c.profiles_by_app && c.profiles_by_app.desk) || null);
const DA = '44444444-4444-4444-4444-444444444402'; const pr = await api('GET', '/iam/profiles/' + (typeof pid === 'string' ? pid : DA)); const pj = D(pr.j) || {};
out.cProfile = pr.s + ' ' + (pj.name || '') + ' sys:' + (pj.is_system || '');
const perms = JSON.stringify(pj.permissions || pj.permission_keys || pj); out.prodPerms = (perms.match(/"[^"]*product[^"]*"(:[^,}]*)?/gi) || []).slice(0, 20); out.permCount = (pj.permissions || []).length;
out.allPermsSample = (pj.permissions || []).map(p => typeof p === 'string' ? p : (p.key || p.code || p.name)).filter(Boolean).slice(0, 80);
return fin({ out });
