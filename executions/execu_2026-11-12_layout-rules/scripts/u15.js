async (page) => {
  const fs = require('fs'), path = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/docs/Credentials/TAVI Desk Credentials.csv';
  const r = fs.readFileSync(path, 'utf8').split(/\r?\n/).slice(1).map(l => l.split(',')).find(x => x[0] === 'ndc-staging-owner');
  const seen = []; const h = x => { const u = x.url(); if (/\/api\//.test(u) && !/iam\/auth/.test(u)) seen.push(x.status() + ' ' + x.request().method() + ' ' + u.replace(/[0-9a-f-]{36}/g, '<id>').replace(/https:\/\/[^/]+/, '')); }; page.on('response', h);
  if (await page.locator('input[type=password]').count()) { await page.locator('input[type=email], input[name=email]').first().fill(r[1].trim()); await page.locator('input[type=password]').fill(r.slice(2).join(',').trim()); await page.keyboard.press('Enter'); await sleep(10000); }
  await page.goto(HOST + '/settings/modules-and-fields', { waitUntil: 'domcontentloaded' }); await sleep(9000); page.off('response', h);
  return { url: page.url(), t: (await bodyText()).slice(0, 400), seen: [...new Set(seen)].filter(s => !/heartbeat|presence|notif/.test(s)).slice(0, 25) };
}
