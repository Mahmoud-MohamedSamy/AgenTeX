// Read-only: ticket-access page in full, permissions page, users with profile/dept/role, org units
const GETS = []; const onG = r => { const u = r.url(); if (r.request().method() === 'GET' && u.includes('/api/v1/') && !/iam\/auth|token/.test(u)) GETS.push(r.status() + ' ' + u.replace(API, '').slice(0, 160)); };
page.on('response', onG);
const main = async () => { const t = (await mtxt()); const i = t.indexOf('Email Providers'); return i > 0 ? t.slice(i + 15) : t; };
await go('/settings/users-control/ticket-access', 9000); out.ta = await main();
for (const tab of ['Ticket statuses', 'Agent availability']) { await page.getByRole('tab', { name: tab }).first().click().catch(() => {}); await sleep(2500); out['ta_' + tab] = await main(); }
GETS.length = 0; await go('/settings/users-control/permissions', 10000); out.perm = (await main()).slice(0, 5000); out.permGets = [...new Set(GETS)].filter(g => !/notif|mass-|tab-settings|sandboxes|mfa|salesiq|hub|resolved|integrations|send-as/.test(g));
await shot('ac2-permissions');
const u = await api('GET', '/iam/users?app_key=desk&page_size=500&page=1'); const A = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results)) || [];
out.usersKeys = Object.keys(A(D(u.j))[0] || {}); out.users = A(D(u.j)).map(x => ({ name: x.display_name || x.name || ((x.first_name || '') + ' ' + (x.last_name || '')), mail: (x.email || '').replace(/^(.{3}).*@/, '$1…@'), id: x.id, prof: JSON.stringify(x.profile || x.profiles || x.profile_name || '').slice(0, 80), role: JSON.stringify(x.role || x.org_unit || x.role_name || '').slice(0, 80), st: x.status }));
const ou = await api('GET', '/iam/org-units?app_key=desk'); out.ou = JSON.stringify(D(ou.j)).slice(0, 2500);
page.off('response', onG);
return fin({ out });
