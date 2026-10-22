await shot('1590-01-review-errors-table');
const c = page.getByRole('button', { name: 'Clear' }); if (await c.count()) { await c.click(); await sleep(1500); }
const tbl1 = (await txt()).match(/All errors[\s\S]*?Rows per page/)?.[0];
await shot('1590-02-review-after-clear');
// expand breakdown rows
const rows = page.locator('table').filter({ hasText: 'Reason' }).locator('tbody tr');
return done({ tbl1, n: await rows.count(), rows: await rows.allInnerTexts() });
