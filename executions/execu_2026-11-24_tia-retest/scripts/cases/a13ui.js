const R = {};
await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await sleep(3000);
const aud = page.locator('[data-testid="tia-audience-card"]');
await aud.locator('label, button, [role=radio]', { hasText: 'Only these profiles and users' }).first().click().catch(() => {}); await sleep(1500);
await aud.locator('button', { hasText: /Choose profiles and users/ }).first().click().catch(e => R.err = String(e).slice(0, 80)); await sleep(3000);
const dlg = page.locator('[role=dialog], [role=listbox], [role=menu]').last(); R.picker = (await dlg.innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 600);
R.msg = (await text()).split('\n').filter(l => /profiles needs|list of profiles|permission to see|can.t see|cannot see|view profiles/i.test(l)).slice(0, 4);
await shot('A-13-picker-open');
await page.keyboard.press('Escape'); await sleep(800);
const disc = aud.locator('button', { hasText: 'Discard' }); if (await disc.count()) { await disc.click().catch(() => {}); await sleep(800); }
R.notLive = (await text()).includes('not live yet');
return R;
