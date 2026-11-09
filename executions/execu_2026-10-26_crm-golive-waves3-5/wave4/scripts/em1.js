const R = 'f68207e6-1bf9-4134-a3ae-7e29db2c45e9';
const a = await call('GET', `/mail/records/leads/${R}/emails`);
const b = await call('GET', `/mail/records/${MODS.leads}/${R}/emails`);
return { byKey: a.s + ' ' + a.t.slice(0, 1500), byId: b.s + ' ' + b.t.slice(0, 300), toast: (await page.innerText('body')).match(/Email sent|sent|failed[^.]*/gi) };
