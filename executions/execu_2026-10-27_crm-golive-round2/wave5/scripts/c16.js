const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3', DEALS = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const res = {};
await page.evaluate(() => localStorage.setItem('anyware_language', 'ar'));
const latin = t => (t.match(/\b[A-Za-z][A-Za-z ]{3,}\b/g) || []).filter(w => !/QA|R2W5|Mahmoud|Mohamed|CRM|EGP|URL|API|NDC|Wonder|Travel|Anyware|Agency|Default|Green|Red|Blue|Rollup|Formula|Number|Email|Text|Pick|Auto|Sub|Child|Module|Layout|Parent|record|example|com|Dialog|Report|Dashboard|Joined|Matrix|chart|filter|Teamspace|Client|ndc|staging|owner|taviportal|Lead|Leads|Customers|Transactions|Tasks|Calls|Meetings|Subscriptions|Services|Daily Move|Cases|Purchase Orders|Sales Orders|NDCAgencies|RT|orphan|anyware|software|Classic View|Standard|Test|Wonder Travel|Created|Modified|Name|Tags|Ctrl/.test(w));
for (const [n, p] of [['leads', '/modules/' + LEADS], ['deals', '/modules/' + DEALS], ['modsetup', '/settings/modules-and-fields/' + M], ['reports', '/reports'], ['dashboards', '/dashboards'], ['home', '/home'], ['datatypes', '/settings/data-types'], ['apiint', '/settings/integration-config'], ['storage', '/settings/storage']]) {
  await page.goto(H + p, { waitUntil: 'domcontentloaded' }); await sleep(7000);
  const t = (await page.innerText('main').catch(() => '')).replace(/\s+/g, ' ');
  res[n] = { dir: await page.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang), english: [...new Set(latin(t))].slice(0, 25), sample: t.slice(0, 200) };
  await shot('c16-ar-' + n);
}
// validation rules + dependency tabs on the QA module in Arabic
await page.goto(H + '/settings/modules-and-fields/' + M, { waitUntil: 'domcontentloaded' }); await sleep(5000);
const tabs = await page.$$eval('[role=tab], main nav button, main nav a', bs => bs.map(b => b.innerText.trim()).filter(Boolean));
res.tabsAr = tabs.slice(0, 15);
await page.evaluate(() => localStorage.setItem('anyware_language', 'en'));
await page.goto(H + '/home', { waitUntil: 'domcontentloaded' }); await sleep(3000);
res.backToEn = await page.evaluate(() => document.documentElement.lang);
return res;
