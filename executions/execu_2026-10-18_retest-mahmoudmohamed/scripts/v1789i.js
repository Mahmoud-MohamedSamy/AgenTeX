const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065'; const out = {};
await panel(); await page.getByRole('button', { name: 'Clear filters' }).click(); await sleep(4000);
out.cleared = { badge: await badge(), total: await total() };
const r = await api('GET', '/modules/' + T + '/list-preferences'); out.storedPref = (r.t.match(/"workqueueFilters":\{[^}]*\}/) || ['none'])[0].slice(0, 200);
await openWQ(); await pick(/^Calls, /); await pick(/^Tasks, /); await sleep(5000);
out.afterReloadAndSwitch = { badge: await badge(), total: await total() }; await shot('NDC-1789-4-cleared-stays');
return done(out);
