await page.getByText('Modules', { exact: true }).first().click(); await sleep(8000);
await page.mouse.click(397, 312); await sleep(20000); await shot('m8-customers-layouts');
const t = (await txt()).split('\n').filter(l => /Standard|All users|Profiles|selected|Layout/i.test(l)).slice(0, 15);
return done({ url: page.url(), t });
