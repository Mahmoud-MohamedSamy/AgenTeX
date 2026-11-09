const o = {};
await page.goto(H + '/profile', { waitUntil: 'commit', timeout: 60000 }); for (let i = 0; i < 30; i++) { await sleep(1000); if ((await txt()).includes('Account information')) break; } await sleep(2000);
await page.getByText('Account information', { exact: true }).first().click(); await sleep(5000);
const t = await txt(); const i0 = t.indexOf('Account information'); o.text = t.slice(i0, i0 + 1200).replace(/\s+/g, ' ');
o.has = ['Time zone', 'Time Zone', 'Date format', 'Time format', 'Language', 'Photo', 'Phone', 'Mobile', 'Extension'].filter(s => t.includes(s));
o.shot = await shot('wave1/W1-05-account-info');
return done(o);
