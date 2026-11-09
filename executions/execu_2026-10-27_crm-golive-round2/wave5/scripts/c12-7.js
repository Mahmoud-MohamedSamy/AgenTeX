const res = {};
const rq = page.waitForResponse(r => /\/teamspaces/.test(r.url()) && r.request().method() === 'POST', { timeout: 30000 }).catch(() => null);
await page.locator('main button', { hasText: /^Save$/ }).click();
const r = await rq; await sleep(4000);
res.save = r ? r.status() + ' ' + (await r.text()).slice(0, 300) : 'none';
res.url = page.url().replace(H, '');
await shot('c12-saved');
const ts = (await call('GET', '/teamspaces')).j.data.find(t => t.name === 'QA R2W5 TS'); res.ts = ts && ts.id;
if (ts) { const d = await call('GET', '/teamspaces/' + ts.id); res.detail = JSON.stringify(d.j.data).slice(0, 900); }
res.leftPane = await page.evaluate(() => { const n = document.querySelector('nav, aside'); return n ? n.innerText.replace(/\s+/g, ' ').slice(0, 300) : ''; });
const mod = await call('GET', '/modules/2a8802cb-7c22-4c51-91ab-277457a0b498'); res.childTeamspace = mod.j.data.teamspaceId;
return res;
