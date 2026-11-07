const o = { errs: [] }; const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
page.on('response', async r => { if (r.status() >= 500 && /records\?/.test(r.url())) o.errs.push(decodeURIComponent(r.url().replace(/^.*api\/v1/, ''))); });
await page.goto(H + '/modules/' + D, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await sleep(2000); if (await page.locator('[data-testid=board-column-total]').count()) break; } await sleep(8000);
require('fs').writeFileSync('../2137-500-urls.txt', o.errs.join('\n')); return { n: o.errs.length, first: (o.errs[0] || '').length };
