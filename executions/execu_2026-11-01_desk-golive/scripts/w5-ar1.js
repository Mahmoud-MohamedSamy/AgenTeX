await go('/hq', 8000);
await page.getByRole('button', { name: /^EN$/ }).first().click(); await sleep(1500); out.langMenu = (await page.locator('[role=menu], [role=listbox]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
await page.getByRole('menuitemradio', { name: /العربية|Arabic/ }).first().click().catch(async () => await page.getByText(/العربية|Arabic/).first().click()); await sleep(5000);
out.dir = await page.evaluate(() => document.documentElement.dir + ' ' + document.documentElement.lang);
const pages = { contacts: '/modules/' + CM, accounts: '/modules/' + AM, contracts: '/modules/' + KM, activities: '/activities', calendar: '/calendar', analytics: '/analytics/dashboards', reports: '/analytics/reports', import: '/settings/data/import', modules: '/settings/modules-and-fields' };
for (const [k, u] of Object.entries(pages)) { await go(u, 9000); const t = (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const words = (t.match(/\b[A-Za-z][a-z]{3,}(?: [A-Za-z][a-z]{2,})*\b/g) || []).filter(w => !/QA|GL|W5|Synced|Desk|CRM|ndc|staging|owner|example|Contact|Account|Contract|Dup|Arabic|Imp|NDC|AEO|AEX|SR1112|VR1112|Wonder|Travel|Freshdesk|Slack/i.test(w));
  out[k] = { dir: await page.evaluate(() => document.documentElement.dir), english: [...new Set(words)].slice(0, 15), keys: (t.match(/\b[a-z]+(\.[a-z_]+){2,}\b/g) || []).slice(0, 5) }; await shot('w5/W5-69-' + k); }
return fin({ out });
