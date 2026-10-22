await page.getByText('Modules and Fields', { exact: true }).first().click(); await sleep(7000);
await page.getByText('Leads', { exact: true }).last().click(); await sleep(7000);
const url = page.url();
const lt = page.getByRole('tab', { name: /Layouts/ }); if (await lt.count()) { await lt.first().click(); await sleep(3000); }
const t = (await txt()).split('Storage Requests')[1]?.slice(0, 1500);
await shot('1588-01-layouts');
return done({ url, t });
