// Owner: Access Control → Selected Users (radio input), inspect picker; H9 empty save; then pick the owner and save (A8).
const cap = []; const onW = r => { if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/') && !/heartbeat|resolved-batch|presence|/iam/auth/.test(r.url())) cap.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 300)); };
page.on('request', onW);
await go('/settings/modules-and-fields', 6000);
const row = page.locator('tr', { hasText: 'QA MF Open' }).first(); await row.hover(); await sleep(300);
await page.locator('button[aria-label="Open menu for QA MF Open1"]').first().click(); await sleep(700);
await page.locator('button,[role=menuitem]', { hasText: /^Access Control$/ }).last().click(); await sleep(1800);
const lab = page.locator('label', { hasText: 'Selected Users' }).last(); const rn = 2;
await lab.click(); await sleep(800); const on = async () => /primary/.test(await lab.locator('div').first().getAttribute('style') || ''); if (!(await on())) { await lab.locator('div').first().click(); await sleep(800); } const selOn = await on();
const s1 = await shot('A8-selected-users');
const modal = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
const save = page.getByRole('button', { name: /^Save$/ }).last(); const saveDisabled = await save.isDisabled();
let h9 = ''; if (!saveDisabled) { await save.click(); await sleep(1500); h9 = ((await txt()).replace(/\s+/g, ' ').match(/Select at least one[^.]*\./) || [''])[0]; }
const s2 = await shot('H9-empty-selection');
rec('H9', /Select at least one user/.test(h9) || saveDisabled ? 'PASS' : 'FAIL', `Selected Users with nothing picked: Save disabled=${saveDisabled}; message "${h9}"`, { shot: s2 });
// try to add the owner as the only principal
const inputs = await page.locator('[role=dialog] input').evaluateAll(es => es.map(e => (e.type || '') + ':' + (e.placeholder || '')));
const btns = await page.locator('[role=dialog] button').allInnerTexts();
rec("A8.ui", "INFO", `Selected Users selected=${selOn}; modal after choosing Selected Users: "${modal.slice(0, 300)}"; inputs ${inputs.join(', ')}; buttons [${btns.join(' | ')}]`, { shot: s1 });
await page.keyboard.press('Escape'); page.off('request', onW);
rec('A8.writes', 'INFO', cap.join(' || ').slice(0, 600));
return done();
