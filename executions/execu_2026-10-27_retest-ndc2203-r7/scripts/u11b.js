page.on("dialog", d => d.accept().catch(() => {})); await api("GET","/desk/departments");
await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith("workflow-rule-draft")).forEach(k => localStorage.removeItem(k)));
await go("/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d", 12000);
const fresh = page.getByRole("button", { name: "Start fresh" }); if (await fresh.count()) { await fresh.click(); await sleep(1500); }
// Condition field picker: full list, then search Contact / Account (nothing saved).
const ec = page.getByRole('button', { name: 'Edit conditions' }); if (await ec.count()) { await ec.first().click({ force: true }); await sleep(1000); }
await page.locator("xpath=//label[contains(normalize-space(.),'matching certain conditions')]").first().click({ force: true }); await sleep(800);
const sf = page.getByRole('button', { name: '— select field —' }); if (!(await sf.count())) { await page.getByRole('button', { name: 'Add condition' }).first().click({ force: true }); await sleep(800); }
await page.getByRole('button', { name: '— select field —' }).first().click({ force: true }); await sleep(1200);
const all = (await page.locator("[role='option']").allInnerTexts()).map(s => s.trim());
await shot('e2-field-picker');
const inp = page.locator("[role='listbox'] input, [cmdk-input], input[placeholder*='earch']").last(); const found = {};
if (await inp.count()) for (const q of ['Contact', 'Account', 'Execution', 'Recent', 'Is Overdue']) { await inp.fill(q); await sleep(900); found[q] = (await page.locator("[role='option']").allInnerTexts()).map(s => s.trim()); if (q === 'Contact') await shot('e3-search-contact'); }
return fin({ count: all.length, all, found, hasSearch: await inp.count() });
