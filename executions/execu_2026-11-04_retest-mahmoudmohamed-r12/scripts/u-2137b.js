// find the Transactions module and its Kanban view; capture the URL and a DOM hint for columns/cards
const o = {}; const mods = await page.evaluate(async () => { const t = document.cookie; return null; });
await page.goto(H + '/', { waitUntil: 'commit', timeout: 120000 }); await sleep(8000);
const api = async p => page.evaluate(async p => { const r = await fetch('/api/v1' + p, { credentials: 'include', headers: { 'x-app-key': 'crm' } }); return r.status + ' ' + (await r.text()).slice(0, 4000); }, p);
const m = await api('/modules'); o.modulesStatus = m.slice(0, 3);
const M = JSON.parse(m.slice(4)).data; const L = Array.isArray(M) ? M : (M.modules || M.items || []); const deals = L.find(x => /transaction|deal/i.test((x.apiName || x.api_name || x.name || '') + ' ' + JSON.stringify(x.labels || x.label || ''))); o.deals = deals && (deals.id + ' ' + (deals.apiName || deals.name));
await page.goto(H + '/modules/' + deals.id, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await sleep(2000); if (/records|Kanban/i.test(await text())) break; } await sleep(3000);
o.url = page.url(); await shot('2137-a-list.png');
o.viewHints = ((await text()).match(/[^\n]*(Kanban|View)[^\n]*/g) || []).slice(0, 10);
return o;
