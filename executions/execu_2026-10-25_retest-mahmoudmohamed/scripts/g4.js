const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1', F = 'daf30263-27bf-484d-8ddf-0ba2133b8f4e';
const f = arr((await api('GET', `/modules/${L}/fields`)).j?.data).find(x => x.id === F);
const lay = (await api('GET', `/modules/${L}/layouts/${LT}`)).j.data;
for (const v of ['CREATE', 'QUICK_CREATE', 'DETAIL']) { const ss = lay.views?.[v]?.layout?.sections; if (!ss || !ss[0]) continue; const col = ss[0].columns[ss[0].columns.length - 1]; if (!ss.some(s => s.columns.some(c => c.fields.some(e => e.id === F)))) col.fields.push(JSON.parse(JSON.stringify(f))); }
const b = { ...lay }; delete b.id; const put = await api('PUT', `/modules/${L}/layouts/${LT}`, b);
await page.goto(H + `/settings/modules-and-fields/${L}/layouts/${LT}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 90; k++) { await sleep(1000); if ((await txt().catch(() => '')).includes('QA RT Pick')) break; } await sleep(1500);
const opt = await page.evaluateHandle(() => { const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'QA RT Pick'); let c = el; for (let k = 0; k < 6; k++) { c = c.parentElement; const b = c.querySelector('button[aria-label="Field options"]'); if (b) return b; } });
await opt.asElement().scrollIntoViewIfNeeded(); await opt.asElement().click({ force: true }); await sleep(900);
await page.getByRole('menuitem', { name: 'Edit Properties' }).click(); await sleep(1500);
const d = await page.evaluate(() => { const x = document.querySelector('[role=dialog]'); return x ? { text: x.innerText.slice(0, 700), btns: [...x.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.innerText).trim()).slice(0, 30), inputs: [...x.querySelectorAll('input')].map(i => (i.getAttribute('aria-label') || i.placeholder) + '=' + i.value).slice(0, 15) } : null; });
await shot('2120-01-props');
return done({ place: put.s, d });
