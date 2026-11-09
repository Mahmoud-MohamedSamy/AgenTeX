// NDC-1172 (b): Settings › Teamspace and the sidebar switcher as a CRM Admin not on QA RT 1172's list.
page.on('dialog', d => d.accept().catch(() => {}));
await go('/settings/teamspace', 12000); await shot('1172-01-settings-teamspace');
const t = (await txt()); const listed = t.includes('QA RT 1172');
let edit = null; if (listed) { await page.getByText('QA RT 1172', { exact: true }).first().click({ force: true }); await sleep(5000); await shot('1172-02-edit-page'); edit = (await txt()).split('\n').filter(l => /admin|denied|permission|QA RT 1172|modules/i.test(l)).slice(0, 10); }
const sw = page.getByText(/^CRM Teamspace$/).first(); let switcher = null;
await go('/', 12000); const s2 = page.getByRole('button', { name: /CRM Teamspace/ }).first(); if (await s2.count()) { await s2.click({ force: true }); await sleep(1500); switcher = (await page.locator('[role=menu], [role=listbox], [role=dialog]').last().innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 15); await shot('1172-03-switcher'); await page.keyboard.press('Escape'); }
return done({ listedInSettings: listed, settingsRows: t.split('\n').filter(l => /Teamspace|QA RT/.test(l)).slice(0, 12), edit, switcher });
