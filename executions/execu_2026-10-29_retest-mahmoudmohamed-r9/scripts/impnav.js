// in-app navigation to Leads › Module actions › Import Leads
page.on('dialog', d => d.accept().catch(() => {}));
if (!/841043e1-c078-41f9-8d6e-dfd61bee45c3$/.test(page.url())) await go('/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3', 40000);
await page.getByRole('button', { name: 'Module actions' }).first().click({ force: true }); await sleep(1200);
await page.getByText(/^Import Leads$/).first().click({ force: true }); await sleep(8000);
