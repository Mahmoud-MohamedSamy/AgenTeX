await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/Global Sets/.test(await text())) break; }
await page.getByRole('tab', { name: /Global Sets/ }).first().click().catch(async()=>{ await page.getByText('Global Sets').last().click(); }); await sleep(5000);
await page.getByRole('button', { name: '1 field', exact: true }).first().click(); await sleep(4000);
const t = await text(); log(t.slice(-1500)); await shot('2806-ui-usedin.png');
