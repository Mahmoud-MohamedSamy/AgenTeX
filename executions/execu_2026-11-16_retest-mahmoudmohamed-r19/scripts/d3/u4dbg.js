const net = []; page.on('response', r => { const u = r.url(); if (!/\.(js|css|png|svg|woff2?|json)(\?|$)/.test(u) || /api/.test(u)) net.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(/^https:\/\//, '').slice(0, 110)); });
await page.goto(H + '/settings/users-control/agents', { waitUntil: 'domcontentloaded' }); await sleep(20000);
const t = (await text()).replace(/\s+/g, ' ');
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/2850-0-agents.png' });
return { t: t.slice(t.indexOf('Agents are'), t.indexOf('Agents are') + 1200).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '<e>'), net: net.filter(x => !/heartbeat|presence/.test(x)).slice(-25) };
