await page.getByText('GENERAL', { exact: true }).last().click({ force: true }); await sleep(1500);
const before = await inputsIn(); await shot('1873-02-general');
const g = (await panelText() || '').split('\n').filter(l => l.trim()).slice(0, 30);
return done({ g, inputs: before.filter(x => !x.ro) });
