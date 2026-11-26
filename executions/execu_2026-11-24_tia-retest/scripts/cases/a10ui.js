const R = {};
await sleep(20000);
await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch') || document.body.innerText.includes("don't have permission"), null, { timeout: 90000 }).catch(() => {}); await sleep(3000);
const t = await text(); R.page = t.includes('Tia switch') ? 'setup page shown' : t.split('\n').filter(l => /permission/i.test(l)).slice(0, 3).join(' | ');
const sw = page.locator('[data-testid="tia-switch-card"]'); R.switchCard = (await sw.innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 300); R.switchToggle = await sw.locator('[role=switch], input[type=checkbox], button[role=switch]').count();
R.switchDisabled = await sw.locator('[role=switch], input[type=checkbox]').first().isDisabled().catch(() => 'n/a');
await shot('A-10-switch-readonly');
const aud = page.locator('[data-testid="tia-audience-card"]'); R.audience = (await aud.innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 400);
const only = aud.locator('label, button, [role=radio]', { hasText: 'Only these profiles and users' }).first(); if (await only.count()) { await only.click().catch(() => {}); await sleep(2000); }
R.audienceAfter = (await aud.innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 500);
await shot('A-13-audience-picker');
const disc = aud.locator('button', { hasText: 'Discard' }); if (await disc.count()) { await disc.click().catch(() => {}); await sleep(800); }
R.editBtn = await page.locator('[data-testid="tia-summary-card"] button', { hasText: 'Edit' }).count();
return R;
