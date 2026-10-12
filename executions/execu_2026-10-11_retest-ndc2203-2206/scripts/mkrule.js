// RULE is injected by mkrule.sh: {name, trigger:'Create'|'Edit'|'Field Changed', field:'Description', value:'...'}
const out = { rule: RULE.name }; await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/workflow-rule-draft/.test(k)) localStorage.removeItem(k); }).catch(() => {}); const off2 = respOn();
await go('/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d', 4000);
for (let i = 0; i < 60; i++) { const t = await txt(); if (t.includes('EXECUTE BASED ON') || t.includes('Resume your draft')) break; await sleep(1000); }
const sf = page.getByRole('button', { name: 'Start fresh' }); if (await sf.count()) { await sf.click(); await sleep(2500); }
await page.getByRole('button', { name: 'Layout' }).click(); await sleep(700); await page.getByRole('option', { name: 'Standard' }).click(); await sleep(1000);
await page.getByRole('button', { name: 'Edit rule name' }).click(); await sleep(600); const nm = page.getByRole('textbox', { name: 'New Workflow Rule' }); await nm.fill(RULE.name); await nm.press('Enter'); await sleep(800);
await page.getByText(/This rule will be executed/).first().click(); await sleep(1000);
await page.getByRole('button', { name: RULE.trigger, exact: true }).click(); await sleep(1000);
await page.getByRole('button', { name: 'Done' }).first().click(); await sleep(800);
await page.getByRole('button', { name: 'Edit conditions' }).click().catch(() => {}); await sleep(800);
await page.getByRole('radio', { name: /Tickets matching certain conditions/ }).click(); await sleep(800);
if (!(await page.getByRole('button', { name: '— select field —' }).count())) { await page.getByRole('button', { name: 'Add condition' }).first().click(); await sleep(800); }
await page.getByRole('button', { name: '— select field —' }).first().click(); await sleep(800);
await page.getByRole('option', { name: 'Priority', exact: true }).click(); await sleep(800);
await page.getByRole('button', { name: 'Operator' }).first().click(); await sleep(600); await page.getByRole('option', { name: 'is one of', exact: true }).click(); await sleep(800);
await page.getByRole('button', { name: 'high', exact: true }).first().click(); await sleep(500); await page.getByRole('button', { name: 'urgent', exact: true }).first().click(); await sleep(500);
const ct = await txt(); out.cond = (ct.match(/Priority[^\n]*\n?[^\n]*/) || [''])[0];
await page.getByRole('button', { name: 'Done' }).last().click().catch(() => {}); await sleep(800);
await page.getByRole('button', { name: 'Add action' }).first().click(); await sleep(800);
await page.getByRole('button', { name: /^Field Update/ }).first().click(); await sleep(1000);
await page.getByRole('button', { name: 'Add field' }).first().click(); await sleep(800);
await page.getByRole('button', { name: '— select field —' }).last().click(); await sleep(800);
out.fuOptions = await page.getByRole('option').allInnerTexts(); if (RULE.listOnly) return done(out); await page.getByRole('option', { name: RULE.field, exact: true }).click(); await sleep(800);
const rm = page.getByRole('button', { name: 'Remove ' + RULE.field }); const row = rm.locator('xpath=..'); await row.getByRole('textbox').fill(RULE.value); await sleep(500);
await shot('NDC-2205-rule-' + RULE.trigger.replace(/ /g, '') + '-before-save');
await page.getByRole('button', { name: 'Save & Activate' }).click(); await sleep(6000);
out.toasts = await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts();
out.resp = capResp.map(s => s.slice(0, 200)); out.url = page.url();
off2(); return done(out);
