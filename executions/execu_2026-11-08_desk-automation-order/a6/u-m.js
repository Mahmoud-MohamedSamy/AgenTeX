await go('/views/all/tickets/e21c1bda-2a5e-470e-8bbf-26b407cb6c4e'); await sleep(7000);
for (const tab of ['HISTORY', 'ACTIVITY']) { await page.getByRole('tab', { name: new RegExp(tab, 'i') }).first().click().catch(async () => { await page.locator('text=' + tab).last().click(); }); await sleep(3500);
  const b = (await text()).replace(/\s+/g, ' '); const i = b.indexOf(tab); log(tab, b.slice(i, i + 1500)); await shot('m-' + tab.toLowerCase()); }
// M3 / Z13: views
await go('/views'); await sleep(6000);
const side = (await page.locator('nav, aside').allInnerTexts()).join(' ').replace(/\s+/g, ' '); log('views side', side.slice(0, 1500));
const vbtn = page.getByText('All Tickets', { exact: false }).first(); await vbtn.click().catch(() => {}); await sleep(2000);
log('view menu', (await text()).replace(/\s+/g, ' ').match(/[^]{0,40}(Blueprint|Transition)[^]{0,200}/gi)?.slice(0, 5)); await shot('m3-views-menu');
// filters on list
log('blueprint words on list page', ((await text()).match(/Blueprint[^\n]{0,60}/g) || []).slice(0, 8));
// Z14 dashboard
await go('/desk/blueprints/dashboard'); await sleep(8000); log('dash url', page.url().replace(H, ''));
log('dashboard', (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 1800)); await shot('z14-dashboard');
await go('/analytics'); await sleep(6000); log('analytics bp', ((await text()).match(/[^\n]{0,40}[Bb]lueprint[^\n]{0,60}/g) || []).slice(0, 6)); await shot('m5-analytics');
