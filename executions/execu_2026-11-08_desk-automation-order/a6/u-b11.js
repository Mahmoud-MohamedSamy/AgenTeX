let block = true;
await page.route(/\/blueprints\?includeInactive/, r => block ? r.abort() : r.continue());
await go('/settings/automation/blueprints'); await sleep(6000);
log('b11', (await page.locator('main').last().innerText()).replace(/\s+/g,' ').slice(-250)); await shot('b11-load-failure');
block = false; const btn = page.getByRole('button', { name: /retry|try again/i }); log('retry btn', await btn.count());
if (await btn.count()) { await btn.first().click(); await sleep(4000); log('after retry', (await page.locator('main').last().innerText()).replace(/\s+/g,' ').slice(-200)); await shot('b11-after-retry'); }
