await page.reload({ waitUntil: 'commit' }); await sleep(20000);
const afterReload = !(await txt()).includes('Loading board');
if (!afterReload) await shot('obs-pipelines-loading-board');
await go('/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', 8000);
await go('/settings/pipelines', 15000);
const viaDeals = !(await txt()).includes('Loading board');
if (viaDeals) { await page.getByRole('button', { name: 'Add Stages' }).nth(1).click(); await sleep(1500); }
const all = (await txt()).match(/Search stages…?([\s\S]*?)Create New Stage/)?.[1];
if (viaDeals) { await page.getByPlaceholder(/Search stages/).fill('qa_rt'); await sleep(1000); }
const filtered = (await txt()).match(/Search stages…?([\s\S]*?)Create New Stage/)?.[1];
await shot('1295-05-addstages-after-delete');
return done({ afterReload, viaDeals, all, filtered });
