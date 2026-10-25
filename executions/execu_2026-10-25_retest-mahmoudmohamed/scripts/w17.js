await sleep(3000);
const a = (await txt()).match(/Total Records (\d+)/)?.[1]; const chips = (await txt()).split('Refresh')[1]?.slice(0, 200);
await shot('1788-08-after-clear');
const prefs = (await api('GET', '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/list-preferences')).j?.data?.prefs?.workqueueFilters;
await page.reload({ waitUntil: 'commit' }); let b = null; for (let k = 0; k < 30; k++) { await sleep(1000); b = (await page.locator('body').innerText().catch(() => '')).match(/Total Records (\d+)/); if (b) break; }
return done({ afterClearNow: a, chips, prefs: JSON.stringify(prefs), afterReload: b && b[1] });
