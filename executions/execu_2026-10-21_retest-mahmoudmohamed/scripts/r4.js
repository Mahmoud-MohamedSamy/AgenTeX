const MID = 'c0394292-52a2-446d-a326-06733fe289ba', LID = '83c29e1a-37f1-4a43-b6b2-33a47cb4b666';
await builder(MID, LID); for (let i = 0; i < 30 && !(await page.getByText('QA MF rx', { exact: true }).count()); i++) await sleep(1500);
await fieldMenu('QA MF rx'); await props('VALIDATION');
const rx = page.getByPlaceholder(/A-Z/).first(); const cur = await rx.inputValue();
await rx.fill('^[A-Z]{2}[0-9]{4}$'); await sleep(500);
await shot('2227-01-regex-builder');
await page.getByRole('button', { name: 'Apply', exact: true }).last().click(); await sleep(1200);
const c = capOn();
const sv = page.getByRole('button', { name: /^Save$/ }); const en = await sv.isEnabled(); if (en) await sv.click();
for (let i = 0; i < 15; i++) { await sleep(1500); if (!/Saving/.test(await txt())) break; }
c();
const fld = (await fieldsOf(MID)).find(f => f.fieldName === 'qa_rx');
const r = await api('POST', `/modules/${MID}/records`, { data: [{ field: 'name', value: enc('QA RT rx') }, { field: 'qa_rx', value: enc('ab12') }], layout_id: LID });
const ok = await api('POST', `/modules/${MID}/records`, { data: [{ field: 'name', value: enc('QA RT rx ok') }, { field: 'qa_rx', value: enc('AB1234') }], layout_id: LID });
return done({ cur, saveEnabled: en, cap, fieldCfg: JSON.stringify(fld.config), bad: r.s + ' ' + (r.j?.error?.details?.[0]?.message || ''), good: ok.s, ids: [r.j?.data?.id, ok.j?.data?.id] });
