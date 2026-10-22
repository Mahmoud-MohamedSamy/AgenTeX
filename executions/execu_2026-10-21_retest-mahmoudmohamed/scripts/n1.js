await page.reload({ waitUntil: 'commit' }); await sleep(8000);
await page.getByText('Lead Conversion Mapping', { exact: true }).first().click(); await sleep(4000);
const targets = (await txt()).match(/Conversion Targets[\s\S]*?Field Mapping/)?.[0];
await go('/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts/563411f4-6c8e-4b98-a91d-c618d88a5138', 12000);
const t = (await txt()).slice(0, 1500);
await shot('1230-01-layout-editor');
return done({ targets, t });
