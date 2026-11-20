const fs = require('fs'); const J = JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/b2/3065.json', 'utf8'));
const out = {};
await page.goto(H + '/views/all/tickets/' + J.t.K1, { waitUntil: 'domcontentloaded' });
await page.getByText('QA RT20 B2 tk K1').first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(6000);
let t = (await text()).replace(/\s+/g, ' '); let i = t.search(/Steps/); out.steps = t.slice(i, i + 260); out.btns = await page.getByRole('button', { name: /^QA onlyA$/ }).count();
await shot('3065-b2-K1-owner-nobody.png');
await page.goto(H + '/settings/automation/blueprints/' + J.tk, { waitUntil: 'domcontentloaded' });
for (let k = 0; k < 40; k++) { await sleep(2000); if (/QA onlyA/.test(await text())) break; }
t = (await text()).replace(/\s+/g, ' '); out.designerWarn = (t.match(/[^.]{0,80}no active owner[^.]{0,80}/gi) || []).slice(0, 3);
return out;
