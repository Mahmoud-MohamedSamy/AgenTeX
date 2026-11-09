page.on('dialog', d => d.accept().catch(() => {}));
await go('/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts/212d0ec2-9ca9-4f39-b524-30275f5fd713', 15000);
await rowMenu('QA RT phone r6', /Set Permission/i); await sleep(800);
await page.getByText('VALIDATION', { exact: true }).last().click({ force: true }); await sleep(1200);
await shot('2423-02-validation-tab');
return done({ panel: (await panelText() || (await txt()).split('VALIDATION')[1] || '').slice(0, 900), inputs: (await inputsIn()).filter(x => !x.ro) });
