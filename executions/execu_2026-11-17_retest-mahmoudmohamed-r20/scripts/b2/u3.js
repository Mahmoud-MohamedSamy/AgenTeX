const fs = require('fs'); const J = JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/b2/3065.json', 'utf8'));
const out = {};
for (const k of ['V1', 'V2']) { await page.goto(H + '/views/all/tickets/' + J.t[k], { waitUntil: 'domcontentloaded' });
  await page.getByText('QA RT20 B2 vo ' + k).first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(5000);
  const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/Steps/); out[k] = { banner: (t.match(/You can (only )?read this ticket[^.]*\./) || ['-'])[0], btns: await page.getByRole('button', { name: /^QA (onlyA|shared)$/ }).count(), steps: i >= 0 ? t.slice(i, i + 110) : '-' };
  await shot('3065-b2-' + k + '-viewonly-agent.png'); }
return out;
