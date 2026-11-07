const o = {}; const bb = async (loc) => { const b = await loc.first().boundingBox().catch(() => null); return b ? [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)] : null; };
await page.goto(H + '/views/all/tickets/db1a4695-ca0e-4073-be47-c841f3ae8682', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/QA RT12 2794 team and agent/.test(await text())) break; } await sleep(4000);
await page.getByRole('tab', { name: /History/i }).first().click(); await sleep(7000);
await shot('2794-a-ticket-history.png');
o.owner = await bb(page.getByText('Ticket Owner', { exact: false }).first()); o.teamBox = await bb(page.getByText(/^Team$/).first());
o.histTop = await bb(page.getByText(/Team was updated|Team was changed|Ticket owner was changed/).first());
const t = await text(); const i = t.lastIndexOf('History'); o.hist = t.slice(i, i + 900);
const kt = t.indexOf('Key Information'); o.key = t.slice(kt, kt + 400);
// open the rule in the editor
await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); for (let k = 0; k < 40; k++) { await sleep(3000); if (/Workflow Rules/.test(await text())) break; }
await page.getByText('Workflow Rules', { exact: true }).first().click(); await sleep(8000);
const s = page.getByPlaceholder(/Search/i).last(); await s.fill('QA RT12 2794').catch(() => {}); await sleep(4000);
await page.getByText('QA RT12 2794 team+agent').first().click().catch(() => {}); await sleep(8000);
const own = page.getByText(/Also assign an agent of this team|keeps the team/i).first(); if (await own.count()) await own.scrollIntoViewIfNeeded();
await sleep(1000); await shot('2794-b-rule.png'); o.ruleBox = await bb(own); o.ruleText = ((await text()).match(/[^\n]*(team|agent)[^\n]*/gi) || []).slice(0, 12);
return o;
