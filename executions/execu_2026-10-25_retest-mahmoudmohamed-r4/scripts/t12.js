const TS = 'c7bb126d-0c55-489f-8924-5fd6f2a98507';
await page.goto(H + '/settings/teamspace', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/QA RT TS/.test(await txt().catch(() => ''))) break; }
const listInfo = (await txt()).split('\n').filter((l, i, a) => /QA RT TS|CRM Teamspace|New Teamspace/.test(a[i - 1] || '') || /QA RT TS/.test(l)).slice(0, 8);
await page.getByText('QA RT TS', { exact: true }).first().click(); await sleep(2500);
const url = page.url().replace(H, '');
const admin = (await txt()).split('Admin')[1]?.split('\n').filter(Boolean).slice(0, 3);
await shot('1700-01-own-ts-admin');
return done({ listInfo, url, admin });
