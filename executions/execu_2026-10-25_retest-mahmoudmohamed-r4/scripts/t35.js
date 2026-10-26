const TS = 'c7bb126d-0c55-489f-8924-5fd6f2a98507';
const mods = arr((await api('GET', `/teamspaces/${TS}/modules`)).j?.data).map(x => x.moduleKey || x.name);
await page.evaluate(() => window.scrollTo(0, 0)); await sleep(300); await page.mouse.click(973, 160); await sleep(1500);
const dlg = await page.evaluate(() => (document.querySelector('[role=alertdialog],[role=dialog]') || {}).innerText?.slice(0, 400) || null);
await shot('1689-03-trash-after-empty');
return done({ serverModules: mods, dlg });
