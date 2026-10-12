const out = {};
await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/workflow-rule-draft/.test(k)) localStorage.removeItem(k); }).catch(() => {});
await go('/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d', 4000);
for (let i = 0; i < 60; i++) { const t = await txt(); if (t.includes('EXECUTE BASED ON') || t.includes('Resume your draft')) break; await sleep(1000); }
const sf = page.getByRole('button', { name: 'Start fresh' }); if (await sf.count()) { await sf.click(); await sleep(2500); }
await page.getByText(/This rule will be executed/).first().click(); await sleep(1000);
out.triggers = await page.getByRole('group', { name: 'Execute based on' }).innerText();
await page.getByRole('button', { name: 'Field Changed', exact: true }).click(); await sleep(1000);
await page.getByRole('button', { name: 'Watch field' }).click(); await sleep(800);
out.watchMulti = (await page.locator('[role=listbox]').first().getAttribute('aria-multiselectable').catch(() => null)) + ' / checkboxes=' + (await page.locator('[role=listbox] [role=checkbox], [role=listbox] input[type=checkbox]').count());
await page.getByRole('option').nth(1).click(); await sleep(600);
out.watchAfter = (await page.getByRole('group', { name: 'Execute based on' }).innerText()).split('WATCH FIELD')[1];
await shot('NDC-2203-triggers');
await page.keyboard.press('Escape');
await page.getByRole('button', { name: 'Add action' }).first().click(); await sleep(800);
out.actions = (await page.locator('button').allInnerTexts()).filter(s => /\n/.test(s) && /record|tag|email|URL|task|owner|happiness/i.test(s)).map(s => s.split('\n')[0]);
await shot('NDC-2203-actions');
await page.getByRole('button', { name: /^Email Send an email/ }).first().click(); await sleep(1500);
const t = await txt(); out.emailPanel = t.slice(t.lastIndexOf('Configure inline'), t.lastIndexOf('Configure inline') + 700);
await shot('NDC-2203-email-action');
return done(out);
