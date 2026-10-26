const TS = 'c7bb126d-0c55-489f-8924-5fd6f2a98507';
const mods = arr((await api('GET', `/teamspaces/${TS}/modules`)).j?.data).map(x => (x.moduleKey || x.name) + ' folder=' + String(x.folderId || '-').slice(0, 8));
await page.goto(H + '/', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/QA RT TS/.test(await txt().catch(() => ''))) break; } await sleep(1500);
const nav = await page.evaluate(() => { const n = document.querySelector('nav.sidebar-scroll') || document.querySelector('nav'); return n ? n.innerText.split('\n').map(s => s.trim()).filter(Boolean) : []; });
await shot('1692-02-home-nav');
return done({ mods, nav: nav.slice(7, 30) });
