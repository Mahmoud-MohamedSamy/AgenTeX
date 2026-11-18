// Read-only: capture access settings pages text + the GET endpoints they call
const GETS = []; const onG = r => { const u = r.url(); if (r.request().method() === 'GET' && u.includes('/api/v1/') && !/iam\/auth|token/.test(u)) GETS.push(r.status() + ' ' + u.replace(API, '').slice(0, 140)); };
page.on('response', onG);
const pages = ['/settings/users-control/ticket-access', '/settings/users-control/data-sharing', '/settings/users-control/roles', '/settings/users-control/profiles', '/settings/users-control/teams', '/settings/users-control/agents'];
out.p = {};
for (const u of pages) { GETS.length = 0; await go(u, 9000); out.p[u] = { url: page.url(), t: (await mtxt()).slice(0, 3000), gets: [...new Set(GETS)].slice(0, 25) }; await shot('ac1-' + u.split('/').pop()); }
page.off('response', onG);
return fin({ out });
