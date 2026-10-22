await go('/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', 8000);
await go('/settings/pipelines', 15000);
const a = !(await txt()).includes('Loading board');
let b = null;
if (!a) { await page.evaluate(() => { history.pushState({}, '', '/settings'); dispatchEvent(new PopStateEvent('popstate')); }); await sleep(3000); await page.getByText('Pipelines', { exact: true }).first().click(); await sleep(12000); b = !(await txt()).includes('Loading board'); }
return done({ a, b });
