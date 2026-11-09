// NDC-2282: Deals › Kanban view toolbar.
page.on('dialog', d => d.accept().catch(() => {}));
await go('/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', 40000);
await page.getByRole('button', { name: 'Kanban view' }).first().click({ force: true }); await sleep(12000);
await shot('2282-01-kanban');
const combos = await page.locator('button[role=combobox]:visible, select:visible, [aria-haspopup=listbox]:visible').evaluateAll(a => a.map(x => ({ text: (x.innerText || x.value || '').trim().slice(0, 40), aria: x.getAttribute('aria-label'), labelledby: x.getAttribute('aria-labelledby'), y: Math.round(x.getBoundingClientRect().y), x: Math.round(x.getBoundingClientRect().x) })));
const labels = await page.locator('label:visible').evaluateAll(a => a.map(x => x.innerText.trim()).filter(Boolean).slice(0, 20));
return done({ combos, labels });
