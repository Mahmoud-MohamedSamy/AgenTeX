// W5-12 badges, W5-10 parent field, W5-71 profile prefs, W5-55 default status
await go('/modules/' + AM, 10000);
out.badges = {};
for (const b of ['Synced', 'Unlinked', 'Needs attention']) { const el = page.locator('main').getByText(b, { exact: true }).first(); if (!(await el.count())) { out.badges[b] = 'not on page'; continue; }
  const title = await el.evaluate(e => (e.getAttribute('title') || e.closest('[title]')?.getAttribute('title') || '') + ' | aria-desc:' + (e.getAttribute('aria-describedby') || e.closest('[aria-describedby]')?.getAttribute('aria-describedby') || '')).catch(() => '');
  await el.hover(); await sleep(1500); out.badges[b] = { title, tip: (await page.locator('[role=tooltip]').allInnerTexts()).join(' / ').slice(0, 200) }; }
await shot('w5r/W5-12-badges');
const lay = await api('GET', '/modules/' + AM + '/fields?limit=300'); const fl = arr(D(lay.j)); out.accFields = fl.length; out.parentLike = fl.filter(f => /parent|hierarch|child|subsid/i.test((f.api_name || f.name || '') + ' ' + (f.label || f.display_name || ''))).map(f => (f.api_name || f.name) + ':' + (f.label || f.display_name) + ':' + (f.type || f.data_type));
await go('/modules/' + AM + '/records/new', 9000); out.accForm = (await mtxt()).slice(0, 900); out.formParent = /parent account/i.test(out.accForm);
// W5-71
const me = await api('GET', '/iam/me'); const mj = D(me.j) || {}; out.meKeys = Object.keys(mj).join(','); out.meTz = JSON.stringify({ tz: mj.timezone || mj.time_zone, df: mj.date_format, loc: mj.locale }).slice(0, 200);
for (const p of ['/iam/me/preferences', '/iam/me/settings', '/users/me/preferences', '/settings/user']) { const r = await api('GET', p); out['pref ' + p] = r.s + ' ' + r.t.slice(0, 200); }
await page.getByRole('button', { name: 'Open profile' }).click().catch(() => {}); await sleep(2000); out.profMenu = (await page.locator('[role=menu],[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await page.keyboard.press('Escape');
for (const u of ['/profile', '/me', '/account', '/settings/personal', '/my-profile']) { await go(u, 6000); const t = await mtxt(); out['page ' + u] = page.url().replace(H, '') + ' | tz:' + /time ?zone/i.test(t) + ' df:' + /date format/i.test(t) + ' | ' + t.slice(0, 160); }
// W5-55: Marketing new-ticket form default status
await go('/modules/' + TM + '/records/new', 9000); out.newT1 = (await mtxt()).match(/Status.{0,60}/)?.[0];
return fin({ out });
