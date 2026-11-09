const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 160)) : undefined });
const o = {}; const pid = 'c83dddbf-983a-4c09-b004-bbfbbfe0fe6b'; const cid = '9b2c929a-51f3-4f3f-a98a-ed76ddc07597';
const add = await api('POST', '/iam/profiles/' + pid + '/permissions', { permission_key: 'desk:macros:manage', effect: 'GRANT' });
const e1 = JSON.stringify((await api('GET', '/iam/profiles/' + pid + '/effective')).j.data); const c1 = JSON.stringify((await api('GET', '/iam/profiles/' + cid + '/effective')).j.data);
const rm = await api('DELETE', '/iam/profiles/' + pid + '/permissions/' + encodeURIComponent('desk:macros:manage'));
const e2 = JSON.stringify((await api('GET', '/iam/profiles/' + pid + '/effective')).j.data);
o.W1_40 = { add: S(add), parentHas: e1.includes('desk:macros:manage'), childInherits: c1.includes('desk:macros:manage'), remove: S(rm), parentHasAfterRemove: e2.includes('desk:macros:manage') };
// UI: invite dialog message for seat limit
await go('/settings/users-control/agents', 20000); const t = await txt();
o.ui = { seats: (t.match(/[^\n]*seat[^\n]*/i) || [''])[0].slice(0, 160), invited: (t.match(/Invited/g) || []).length, raw: (t.match(/\b[a-z]+\.[a-z_]+\.[a-z_.]+\b/g) || []).slice(0, 5) };
const btn = page.getByRole('button', { name: /invite|add agent|new agent/i }).first(); o.ui.inviteBtn = await btn.count();
if (o.ui.inviteBtn) { await btn.click(); await sleep(3000); const d = await txt(); o.ui.dialog = d.slice(d.length - 900).replace(/\s+/g, ' ').slice(0, 700);
  const email = page.locator('input[type=email], input[name*=email i]').first(); if (await email.count()) { await email.fill('mmohamed@anyware.software'); await sleep(500); }
  o.ui.shotDialog = await shot('wave1/W1-29-invite-dialog'); await page.keyboard.press('Escape'); }
return done(o);
