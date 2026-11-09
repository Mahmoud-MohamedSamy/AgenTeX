const o = {};
await page.goto(H + '/views/all/tickets', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40; i++) { await sleep(3000); if (/All Tickets/.test(await text())) break; } await sleep(3000);
await page.getByText(/All Tickets \(\d+\)/).first().click(); await sleep(3000); await shot('a5-agent-views-menu.png');
o.menu = ((await text()).match(/(My Transitions|Transition)[\s\S]{0,80}/gi) || []).slice(0, 5);
const mt = page.getByText(/My Transitions/i).first(); o.found = await mt.count();
if (o.found) { await mt.click(); await sleep(8000); await shot('a6-agent-my-transitions.png'); const t = await text(); o.list = (t.match(/QA RT13 2754F G\d[^\n]*/g) || []).slice(0, 10); o.head = (t.match(/My Transitions[^\n]*/) || [''])[0]; }
return o;
