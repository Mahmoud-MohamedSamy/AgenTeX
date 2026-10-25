const res = {};
await page.locator('label').filter({ hasText: /^mahmoud\.mahamed1515$/ }).first().click(); await sleep(3500);
res.me = (await txt()).match(/Total Records (\d+)/)?.[1]; await shot('1788-07-created-by-me');
await page.locator('label').filter({ hasText: /^mahmoud\.mahamed1515$/ }).first().click(); await sleep(800);
await page.locator('label').filter({ hasText: /^ndc-staging-owner$/ }).first().click(); await sleep(3500);
res.owner = (await txt()).match(/Total Records (\d+)/)?.[1] ?? ((await txt()).includes('No ') ? '0 (empty)' : '?');
await page.getByRole('button', { name: /Clear filters/ }).click().catch(() => {}); await sleep(2000);
res.afterClear = (await txt()).match(/Total Records (\d+)/)?.[1];
return done(res);
