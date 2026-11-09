// NDC-1444 / NDC-2383: rollup on QA layout, Save, verify persisted.
page.on('dialog', d => d.accept().catch(() => {}));
await go('/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts/212d0ec2-9ca9-4f39-b524-30275f5fd713', 15000);
await drag(/^Rollup Sum/, 800, 600);
await page.getByText('ADVANCED', { exact: true }).last().click({ force: true }); await sleep(1200);
await shot('1444-01-rollup-advanced');
const p = (await panelText() || '').split('\n').filter(l => l.trim()).slice(0, 40);
const selects = await page.locator('select:visible').evaluateAll(a => a.map(s => ({ name: s.name || s.id, opts: [...s.options].map(o => o.text).slice(0, 25) })));
return done({ p, selects });
