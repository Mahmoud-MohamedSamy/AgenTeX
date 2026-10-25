await page.locator('label').filter({ hasText: /^High$/ }).first().click(); await sleep(3500);
const rows = await page.locator('tbody tr').allInnerTexts();
const subj = rows.map(r => (r.match(/QA RT wq t\d+/) || [r.slice(0, 30)])[0]);
const head = (await txt()).match(/Tasks\n\d+/)?.[0];
await shot('1788-05-high-applied');
const prefs = (await api('GET', '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/list-preferences')).j?.data;
return done({ subj, head, wq: JSON.stringify(prefs?.prefs?.workqueueFilters || prefs?.prefs).slice(0, 400), version: prefs?.version });
