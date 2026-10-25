const tot = async () => { for (let k = 0; k < 20; k++) { await sleep(800); const m = (await txt()).match(/Total Records (\d+)/); if (m && !(await page.locator('tbody tr').filter({ hasText: /^\s*$/ }).count() > 3)) return m[1]; } return (await txt()).match(/Total Records (\d+)/)?.[1]; };
const names = async () => (await page.locator('tbody tr').allInnerTexts()).map(r => r.split('\n').map(x => x.trim()).filter(Boolean)[0] || '').filter(Boolean);
await page.getByText('Other User Records', { exact: false }).first().click(); await sleep(4000);
const out = { other: { total: await tot(), names: await names() } };
const first = [...new Set(out.other.names.map(n => n[0].toUpperCase()))].filter(c => /[A-Z]/.test(c));
out.letters = first;
if (first.length) { const L = first[0]; await page.locator('button, [role=tab], a').filter({ hasText: new RegExp('^' + L + '$') }).first().click(); await sleep(3500);
  out.letter = { L, total: await tot(), names: await names() }; await shot('1819-11-az-letter');
  // combine with a normal filter: Lead Status contains any of No Answer (all rows are No Answer) then a filter that excludes
  await page.getByRole('button', { name: 'Filter', exact: true }).click(); await sleep(1200); await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(900);
  await page.locator('[role=option], [role=listbox] li').filter({ hasText: /^Full Name$/ }).first().click().catch(() => {}); await sleep(1200);
  out.filterRow = (await txt()).split('Full Name')[1]?.slice(0, 200);
  await shot('1819-12-az-plus-filter-row');
  // back to All letter
  await page.locator('button, [role=tab], a').filter({ hasText: /^All$/ }).first().click(); await sleep(3000); out.afterAll = { total: await tot() };
}
return done(out);
