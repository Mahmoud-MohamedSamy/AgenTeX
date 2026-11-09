const out = {}; await go('/settings', 6000); for (let j = 0; j < 60 && !(await txt()).includes('Signals'); j++) await sleep(2000);
await page.getByText('Signals', { exact: true }).first().click(); for (let j = 0; j < 40 && !/mail|Email opened|Reminder|signal/i.test((await txt()).split('Signals').slice(1).join('')); j++) await sleep(2000); await sleep(3000);
await shot('v24-signals'); out.url = page.url();
const t = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); out.rawKeys = t.filter(l => /^[a-z_]+\.[a-z_.*]+$/.test(l)).slice(0, 25);
const i = t.lastIndexOf('Signals'); out.list = t.slice(i, i + 80).filter(l => l.length < 70);
return done(out);
