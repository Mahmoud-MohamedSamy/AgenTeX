const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = { loads: [] };
for (let k = 0; k < 3; k++) { await page.goto(H + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(k === 0 ? 3500 : 7000);
  const rows = (await page.locator('tbody tr').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').slice(0, 90)); R.loads.push({ n: rows.length, uuid: rows.filter(r => /[0-9a-f]{8}-[0-9a-f]{4}-/.test(r)).length, vrLayoutNamed: rows.filter(r => /QA RT18 VR Layout/.test(r)).length });
  if (k === 0) await shot('3019-2-list-early.png'); }
await shot('3019-3-list-reload.png');
return R;
