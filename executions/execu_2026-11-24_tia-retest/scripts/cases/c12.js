const R = {};
await go('/'); await sleep(7000);
R.url = page.url().replace(/[?#].*/, ''); R.launcher = await page.locator('[data-testid="tia-launcher"]').count();
R.head = (await text()).slice(0, 120).replace(/\s+/g, ' ');
if (R.launcher) { await page.locator('[data-testid="tia-launcher"]').click(); await sleep(2000); R.panel = (await page.locator('[data-testid="tia-panel"]').innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 400); }
await shot('C-12-' + process.env.APP + '-launcher');
return R;
