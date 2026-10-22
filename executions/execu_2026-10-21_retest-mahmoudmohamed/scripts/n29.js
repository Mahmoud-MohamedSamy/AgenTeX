const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const all = []; const f = r => { if (!/\.(js|css|png|svg|woff2?)/.test(r.url())) all.push(r.method() + ' ' + r.url().slice(0, 140)); }; page.on('request', f);
for (let i = 0; i < 20; i++) { await sleep(2000); if (!/Saving/.test(await page.locator('body').innerText())) break; }
page.off('request', f);
const lay = (await api('GET', `/modules/${L}/layouts`)).j.data.find(l => l.name === 'FieldPermissions');
const saving = /Saving/.test(await page.locator('body').innerText());
await shot('1444-12-after-wait');
return done({ saving, inLayout: JSON.stringify(lay.views).includes('6a570979'), mod: lay.lastModifiedAt, reqs: all.filter(x => !/notif|hubs|heartbeat/.test(x)).slice(0, 20) });
