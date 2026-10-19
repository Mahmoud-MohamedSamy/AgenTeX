const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065'; const out = {};
await shot('NDC-1789-3-new-login'); out.newLogin = { url: page.url().replace(H, ''), badge: await badge(), total: await total() };
const r = await api('GET', '/modules/' + T + '/list-preferences'); out.storedPref = (r.t.match(/"workqueueFilters":\{[^}]*\}/) || ['none'])[0].slice(0, 200);
await pick(/^Calls, /); await pick(/^Tasks, /); let b = ''; for (let i = 0; i < 10; i++) { b = await badge(); if (/applied/.test(b)) break; await sleep(1000); }
out.afterSectionSwitch = { badge: b, total: await total() };
return done(out);
