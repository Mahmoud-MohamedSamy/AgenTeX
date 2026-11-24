const tid = id => page.locator(`[data-testid="${id}"]`);
await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await page.waitForTimeout(2000);
const near = async (id) => (await tid(id).locator('xpath=ancestor::*[contains(@data-testid,"card")][1]').innerText().catch(() => '')).replace(/\n+/g, ' / ');
const daily = tid('tia-cap-daily').locator('input').first().or(tid('tia-cap-daily')).first();
const dIn = (await tid('tia-cap-daily').locator('input').count()) ? tid('tia-cap-daily').locator('input').first() : tid('tia-cap-daily');
const mIn = (await tid('tia-cap-monthly').locator('input').count()) ? tid('tia-cap-monthly').locator('input').first() : tid('tia-cap-monthly');
const caps = async v => { await dIn.fill(v[0]); if (v[1] !== undefined) await mIn.fill(v[1]); await page.waitForTimeout(600); return (await tid('tia-caps-card').innerText()).replace(/\n+/g, ' / ').slice(0, 600); };
// B-05 leave guard
await dIn.fill('123'); await page.waitForTimeout(400);
await page.getByText('Departments', { exact: true }).first().click({ timeout: 10000 }).catch(e => log('nav click err', e.message.slice(0,80))); await page.waitForTimeout(1500);
log('B-05 guard', (await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => 'no dialog')).replace(/\n+/g, ' / '), 'url', page.url());
await shot('B05-leave-guard');
await page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: 'Keep editing' }).first().click().catch(() => {}); await page.waitForTimeout(800);
// B-04 discard
await tid('tia-caps-card').locator('button', { hasText: 'Discard' }).click().catch(() => {}); await page.waitForTimeout(800); log('B-04 after discard daily', await dIn.inputValue());
// G-16 strong steps 11
const su = (await tid('tia-strong-user').locator('input').count()) ? tid('tia-strong-user').locator('input').first() : tid('tia-strong-user');
await su.fill('11'); await page.waitForTimeout(500); log('G-16', (await tid('tia-strong-steps-card').innerText()).replace(/\n+/g, ' / ').slice(0, 400)); await su.fill(''); await tid('tia-strong-steps-card').locator('button', { hasText: 'Discard' }).click().catch(() => {});
// C-10 apps none
for (const a of ['crm', 'salesiq', 'desk', 'analytics']) { const c = tid('tia-app-' + a); if (await c.isChecked()) await c.uncheck(); }
await page.waitForTimeout(600); log('C-10', (await tid('tia-apps-card').innerText()).replace(/\n+/g, ' / '), 'save disabled', await tid('tia-apps-card').locator('button', { hasText: 'Save' }).isDisabled().catch(() => 'n/a')); await shot('C10-no-apps');
await tid('tia-apps-card').locator('button', { hasText: 'Discard' }).click().catch(() => {}); await page.waitForTimeout(600);
// D-05 audience only, no chips
const only = tid('tia-audience-card').locator('label, button, [role=radio]', { hasText: 'Only these profiles and users' }).first();
await only.click().catch(() => {}); await page.waitForTimeout(800); log('D-05', (await tid('tia-audience-card').innerText()).replace(/\n+/g, ' / ').slice(0, 500)); await shot('D05-nobody');
await tid('tia-audience-card').locator('button', { hasText: 'Discard' }).click().catch(() => {}); await page.waitForTimeout(600);
// E-13 explain only
log('E-13 sample', (await tid('tia-area-crm.workflow_runs').innerText().catch(() => '')).replace(/\n+/g, ' '), '|', (await tid('tia-area-crm.workflow_rules').innerText().catch(() => '')).replace(/\n+/g, ' '));
// A-19 report link
const rl = tid('tia-report-access-card').locator('a').first(); log('A-19 link', await rl.getAttribute('href').catch(() => 'no link'), (await tid('tia-report-access-card').innerText()).replace(/\n+/g, ' / '));
// E-01 edit dialog
await tid('tia-summary-card').locator('button', { hasText: 'Edit' }).click(); await page.waitForTimeout(2500); await shot('E01-edit-dialog');
const dlg = page.locator('[role=dialog]').last(); log('E-01 dialog', (await dlg.innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 1500));
return 'ok';
