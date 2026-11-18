const fs = require('fs'); const J = JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/b2/3065.json', 'utf8'));
const out = {}; const sub = { K1: 'tk K1', K2: 'tk K2', SF: 'sh SF', SR: 'sh SR', SX: 'sh SX', SN: 'sh SN', XF: 'xdf XF', XR: 'xdr XR' };
for (const [k, s] of Object.entries(sub)) {
  await page.goto(H + '/views/all/tickets/' + J.t[k], { waitUntil: 'domcontentloaded' });
  await page.getByText('QA RT20 B2 ' + s).first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(5000);
  const t = (await text()).replace(/\s+/g, ' ');
  const i = t.search(/Steps|No transitions/);
  out[k] = { banner: (t.match(/You can (only )?read this ticket[^.]*\.|This ticket is not available[^.]*|Permission denied/) || ['-'])[0], btns: (await page.getByRole('button', { name: /^QA (onlyA|xd)$/ }).allInnerTexts()), steps: i >= 0 ? t.slice(i, i + 120) : '-', noTr: /No transitions you can run/.test(t) };
  await shot('3065-b2-' + k + '-agent.png');
}
return out;
