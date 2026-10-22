await shot('obs-pipelines-loading-board');
let tries = 0, ok = false;
for (; tries < 6 && !ok; tries++) { await go(tries % 2 ? '/settings/pipelines' : '/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', 5000); if (tries % 2) { for (let i = 0; i < 20 && !ok; i++) { await sleep(1000); ok = !!(await page.getByText('QA RT 1325 pipeline', { exact: true }).count()); } } }
return done({ tries, ok });
