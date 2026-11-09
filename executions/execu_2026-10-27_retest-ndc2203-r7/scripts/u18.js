const out = {};
{ const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF probe 4f', isActive: false, mode: 'Recurring', trigger: { kind: 'SpecificFieldChanged', fieldNames: ['description', 'phone', 'due_date', 'subject'], fieldMatch: 'any' }, criteria: guard('QA WF probe '), actions: [{ order: 0, type: 'AddTicketComment', commentBody: 'x', commentPublic: false }] }); if (r.j?.data?.id) await api('DELETE', `/workflow/rules/${r.j.data.id}`); out.fourFields = r.s + ' ' + (r.s >= 300 ? JSON.stringify(r.j?.error?.details || r.j?.error?.message).slice(0, 200) : 'accepted'); }
page.on('dialog', d => d.accept().catch(() => {}));
await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
await go('/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d', 12000);
const fresh = page.getByRole('button', { name: 'Start fresh' }); if (await fresh.count()) { await fresh.click(); await sleep(1500); }
const ec = page.getByRole('button', { name: 'Edit conditions' }); if (await ec.count()) { await ec.first().click({ force: true }); await sleep(800); }
await page.locator("xpath=//label[contains(normalize-space(.),'matching certain conditions')]").first().click({ force: true }); await sleep(800);
if (!(await page.getByRole('button', { name: '— select field —' }).count())) { await page.getByRole('button', { name: 'Add condition' }).first().click({ force: true }); await sleep(800); }
const pick = async name => { await page.getByRole('button', { name: /select field|— / }).last().click({ force: true }); await sleep(900); const inp = page.locator("[role='listbox'] input, [cmdk-input], input[placeholder*='earch']").last(); await inp.fill(name); await sleep(800); await page.locator("[role='option']", { hasText: name }).first().click({ force: true }); await sleep(1000); };
await pick('Due Date');
const opBtn = page.locator('button, [role=combobox]').filter({ hasText: /^(is|equals|before|after|between|—)/i }).last();
await opBtn.click({ force: true }).catch(() => {}); await sleep(1000); await shot('e5-date-operators');
out.dateOps = (await page.locator("[role='option']").allInnerTexts()).map(s => s.trim());
const nb = page.locator("[role='option']", { hasText: /^before$/i }).first(); if (await nb.count()) { await nb.click({ force: true }); await sleep(1000); await shot('e6-current-time'); out.afterBefore = (await txt()).split('\n').filter(l => /current time|compare with/i.test(l)).slice(0, 5); }
return fin(out);
