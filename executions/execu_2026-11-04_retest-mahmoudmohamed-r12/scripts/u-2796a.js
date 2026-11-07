const o = {}; const bb = async (loc) => { const b = await loc.first().boundingBox().catch(() => null); return b ? [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)] : null; };
await page.goto(H + '/views/all/tickets/4b24aafb-47bc-42f8-8352-33ba90ab841f', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/QA RT12 2796 accounting no layout/.test(await text())) break; } await sleep(4000);
o.fields = ((await text()).match(/IATA Source|ADM Number|Airline Code|ADM Reason/g) || []).join(',');
await page.locator('button[aria-label*="More" i], button[aria-label*="actions" i]').last().click().catch(() => page.locator('header button').last().click()); await sleep(1500);
o.menu = (await page.getByRole('menuitem').allInnerTexts()).map(s => s.trim());
const cl = page.getByRole('menuitem', { name: /Change Layout/i }); if (await cl.count()) { await cl.first().click(); await sleep(3000); }
await shot('2796-a-change-layout.png');
const dlg = page.getByRole('dialog'); o.dialog = (await dlg.innerText().catch(() => '')).slice(0, 800);
const s = dlg.locator('select'); if (await s.count()) o.options = await s.first().evaluate(x => ({ value: x.selectedOptions[0]?.text, options: [...x.options].map(y => y.text) }));
else { const cb = dlg.getByRole('combobox'); if (await cb.count()) { await cb.first().click(); await sleep(1500); o.options = (await page.getByRole('option').allInnerTexts()).map(s => s.trim()); await shot('2796-b-change-layout-open.png'); } }
o.boxDlg = await bb(dlg);
return o;
