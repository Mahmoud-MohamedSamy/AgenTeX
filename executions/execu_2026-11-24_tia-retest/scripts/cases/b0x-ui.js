await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await sleep(3000);
const card = page.locator('[data-testid="tia-summary-card"]');
const dep = card.locator('button', { hasText: /Deploy changes/ });
const R = { cardText: (await card.innerText()).replace(/\n+/g, ' / ').slice(0, 500), deployDisabled: await dep.isDisabled().catch(() => 'n/a'), banner: (await text()).split('\n').filter(l => /not live|choose|before you deploy|custom action|modules it may/i.test(l)).slice(0, 6) };
const tip = await dep.getAttribute('title').catch(() => null); R.tip = tip;
await dep.hover().catch(() => {}); await sleep(800); R.tooltip = (await page.locator('[role=tooltip]').allInnerTexts().catch(() => [])).join(' | ');
await shot('B-' + process.env.MODE + '-setup-page', { fullPage: false });
return R;
