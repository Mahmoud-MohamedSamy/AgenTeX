const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const sp = await api('GET', `/modules/${D}/stage-probability`);
const sp1 = await api('GET', `/modules/${D}/stage-probability?pipeline_id=640e03a4-9c24-4b06-8d7d-5c1db2711b9b`);
await page.getByRole('button', { name: 'Stage Probability' }).click(); await sleep(2500);
const dlg = await page.locator('[role=dialog]').innerText();
await shot('1308-01-modal-standard');
return done({ sp: sp.t.slice(0, 1200), sp1: sp1.s + ' ' + sp1.t.slice(0, 1200), dlg });
