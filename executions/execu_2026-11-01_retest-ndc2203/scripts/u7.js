page.on('dialog', d => d.accept().catch(() => {}));
await api('GET', '/desk/departments');
await go('/settings/automation/workflow-rules/d3094efc-e240-40d5-97d1-ada338f2c9f4', 12000); await shot('d1-rule-editor');
const t = (await txt()).split('\n').filter(l => l.trim()); const i = t.findIndex(l => /ACTION/i.test(l));
// open the owner assignment action card
const card = page.getByText('Owner Assignment', { exact: false }).first(); if (await card.count()) { await card.click({ force: true }); await sleep(2000); await shot('d1-owner-card'); }
const t2 = (await txt()).split('\n').filter(l => l.trim());
return fin({ actionArea: t.slice(i, i + 25), card: t2.filter(l => /team|agent|round|load|owner|assign/i.test(l)).slice(0, 25) });
