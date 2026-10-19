const out = {};
const row = async () => (await page.locator('[role=group][aria-label="Filter these records"]').innerText().catch(() => 'no panel')).replace(/\s+/g, ' ');
const open = async () => { if (!(await page.getByRole('button', { name: 'Criteria field' }).count())) { const b = page.locator('main button[aria-label*="ilter"]').first(); if (await b.count()) { await b.click(); await sleep(1500); } } };
for (const q of [/^All Leads/, /^My Leads/, /^test/, /^EveryLeadWithNoAns/]) {
  await page.getByRole('button', { name: q }).first().click(); await sleep(6000); await open();
  out[String(q)] = { row: await row(), total: ((await page.locator("main").last().innerText()).match(/Total Records\s*\d+/) || [''])[0] };
  if (/All Leads/.test(String(q))) await shot('NDC-1787-all-leads-filter');
}
return done(out);
