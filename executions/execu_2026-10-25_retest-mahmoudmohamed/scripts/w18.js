await page.getByRole('group', { name: 'Filter these records' }).getByRole('button', { name: 'Clear filters' }).click(); await sleep(3500);
const a = (await txt()).match(/Total Records (\d+)/)?.[1];
const prefs = (await api('GET', '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/list-preferences')).j?.data?.prefs?.workqueueFilters;
return done({ afterClear: a, prefs: JSON.stringify(prefs) });
