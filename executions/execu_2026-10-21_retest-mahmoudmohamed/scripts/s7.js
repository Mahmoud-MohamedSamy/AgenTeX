await page.getByText('Ticket Owner', { exact: true }).first().click(); await sleep(2500);
const panel = (await txt()).split('Ticket Owner')[1]?.split('\nTeam\n')[0];
await page.getByText('Ticket Owner', { exact: true }).first().scrollIntoViewIfNeeded(); await shot('2218-02-owner-list');
const dir = arr((await api('GET', '/iam/users/directory?scope=org&app_key=desk')).j?.data).map(u => (u.display_name || u.displayName || u.name) + ' <' + u.email + '>');
const ag = await api('GET', '/desk/agents?limit=100'); const agents = arr(ag.j?.data).map(a => (a.display_name || a.displayName || a.name || a.full_name) + ' <' + (a.email || '') + '>');
return done({ panel, dir, agents: ag.s + ' ' + JSON.stringify(agents) });
