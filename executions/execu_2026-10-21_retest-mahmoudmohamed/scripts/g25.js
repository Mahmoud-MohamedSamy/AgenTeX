const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await sleep(4000);
const r = await api('GET', `/modules/${L}/records/2e3666fe-3f70-427a-b2d8-0a4cee463a8c`);
const still = await page.locator('tr').filter({ hasText: 'QA RT imp p50' }).count();
return done({ rec: r.s, stillInBin: still, toasts: await page.locator('[data-sonner-toast]').allInnerTexts(), shot: await shot('1587-05-restored') });
