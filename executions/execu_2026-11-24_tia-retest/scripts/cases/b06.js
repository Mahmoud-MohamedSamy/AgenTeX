const R = { dialogs: [] };
page.on('dialog', async d => { R.dialogs.push(d.type() + ':' + (d.message() || '')); await d.dismiss().catch(() => {}); });
await go('/settings'); await sleep(2000);
await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await sleep(2500);
const inp = page.locator('[data-testid="tia-cap-daily"] input').first().or(page.locator('[data-testid="tia-cap-daily"]')).first();
const before = await inp.inputValue().catch(() => ''); R.before = before;
await inp.fill(String((parseInt(before) || 0) + 7)); await sleep(500);
// reload attempt
await page.reload({ timeout: 8000 }).catch(e => R.reloadErr = String(e).slice(0, 80)); await sleep(2000);
R.afterReloadUrl = page.url().replace(/[?#].*/, ''); R.valueAfterReload = await inp.inputValue().catch(() => 'n/a');
// back attempt (re-edit first)
if (R.dialogs.length === 0 || R.valueAfterReload === before) { await inp.fill(String((parseInt(before) || 0) + 7)).catch(() => {}); await sleep(400); }
await page.goBack({ timeout: 8000 }).catch(e => R.backErr = String(e).slice(0, 80)); await sleep(2500);
R.afterBackUrl = page.url().replace(/[?#].*/, '');
const guard = page.locator('[role=dialog], [role=alertdialog]').last(); R.inAppGuard = (await guard.innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 200);
await shot('B-06-back-guard');
const keep = page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /Keep editing/i }); if (await keep.count()) await keep.first().click();
await sleep(800);
if (page.url().includes('/integrations/tia')) { const disc = page.locator('[data-testid="tia-caps-card"] button', { hasText: 'Discard' }); if (await disc.count()) { await disc.click().catch(() => {}); await sleep(800); } R.finalValue = await inp.inputValue().catch(() => 'n/a'); }
return R;
