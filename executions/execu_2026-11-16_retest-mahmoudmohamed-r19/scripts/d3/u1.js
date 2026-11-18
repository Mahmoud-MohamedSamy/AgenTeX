const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const L = [['157e7204-0030-4208-98c6-4106d07a320e', '3066-1-4699'], ['818b1205-27ff-4889-85a3-8bc6cc0ae8bf', '3066-2-4700'], ['759aac1f-1608-4239-aaae-e81cb8dd3104', '3066-3-4166'], ['f5955ca9-75d0-460d-8e00-0c50d26f25f8', '3066-4-4165']];
const res = {};
for (const [id, tag] of L) {
  await page.goto(H + '/views/all/tickets/' + id, { waitUntil: 'domcontentloaded' });
  await page.getByText(/QA BP RT19/).first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(4000);
  const tab = page.getByRole('tab', { name: /History/i }).first(); if (await tab.count()) await tab.click(); else await page.getByText(/^History$/).first().click();
  await sleep(5000);
  await page.screenshot({ path: RAW + tag + '-history.png' });
  const ht = (await text()).replace(/\s+/g, ' '); const hi = ht.search(/Moved by|Transition QA/);
  res[tag] = ht.slice(Math.max(0, hi - 300), hi + 1500);
}
return res;
