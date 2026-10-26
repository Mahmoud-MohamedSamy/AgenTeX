const ID = '01727195-e2d5-41c5-821b-a30d5a965976', LID = 'd4540d27-5861-4c6c-adf8-7433a717348b'; const out = {};
await page.goto(H + `/settings/modules-and-fields/${ID}/layouts/${LID}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 40; k++) { await sleep(1000); if (/NEW SECTION/.test(await txt().catch(() => ''))) break; } await sleep(2000);
await page.locator('button', { hasText: 'NEW SECTION' }).last().click(); await sleep(800);
await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(5000);
const F = arr((await api('GET', `/modules/${ID}/fields`)).j?.data).filter(f => /^qa_rt_(file|img)$|^name$/.test(f.fieldName));
const lay = (await api('GET', `/modules/${ID}/layouts/${LID}`)).j.data; let placed = 0;
for (const v of ['CREATE', 'QUICK_CREATE', 'DETAIL']) { const ss = lay.views?.[v]?.layout?.sections; if (!ss || !ss[0]) continue; const col = ss[0].columns[ss[0].columns.length - 1]; for (const f of F) if (!ss.some(s => s.columns.some(c => c.fields.some(e => e.id === f.id)))) { col.fields.push(JSON.parse(JSON.stringify(f))); placed++; } }
const b = { ...lay }; delete b.id; out.place = (await api('PUT', `/modules/${ID}/layouts/${LID}`, b)).s + ' placed ' + placed;
return done(out);
