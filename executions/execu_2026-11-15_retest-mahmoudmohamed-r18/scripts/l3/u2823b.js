await page.goto(H + '/views', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/All Tickets/.test(await text())) break; }
const lk = page.getByText('QA RT18 3028 view', { exact: true }).first(); await lk.scrollIntoViewIfNeeded(); await lk.click();
for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA RT18 3028 \d\d/.test(await text())) break; } await sleep(3000);
await page.getByRole('checkbox', { name: /select all/i }).first().click(); await sleep(2000);
log('after header', ((await text()).match(/[^\n]*selected[^\n]*|Select all \d+[^\n]*/gi) || []).slice(0, 3)); await shot('2823-1a-header-50.png');
await page.getByText(/Select all \d+ in this view/i).first().click(); await sleep(2500);
log('after link', ((await text()).match(/[^\n]*selected[^\n]*|All \d+[^\n]*/gi) || []).slice(0, 3)); await shot('2823-1b-all-60.png');
