await go('/workqueue/activities/tasks', 6000);
let tr = null; for (let k = 0; k < 30; k++) { await sleep(1000); tr = (await txt()).match(/Total Records (\d+)/); if (tr) break; } await sleep(1500);
const rows = (await page.locator('tbody tr').allInnerTexts()).map(r => (r.match(/QA RT wq t\d+/) || ['?'])[0]);
await shot('1789-04-new-login');
// Clear filters then reload
await page.getByRole('button', { name: /Clear filters/ }).click(); await sleep(3000);
const afterClear = (await txt()).match(/Total Records (\d+)/);
const prefs = (await api('GET', '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/list-preferences')).j?.data?.prefs?.workqueueFilters;
await page.reload({ waitUntil: 'commit' }); let tr2 = null; for (let k = 0; k < 30; k++) { await sleep(1000); tr2 = (await page.locator('body').innerText().catch(() => '')).match(/Total Records (\d+)/); if (tr2) break; }
await shot('1789-05-after-clear-reload');
return done({ newLogin: `Total ${tr && tr[1]} rows ${rows.join(',')}`, afterClear: afterClear && afterClear[1], prefsAfterClear: JSON.stringify(prefs), afterClearReload: tr2 && tr2[1] });
