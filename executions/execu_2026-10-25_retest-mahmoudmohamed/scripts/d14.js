const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', A = '95503f26-c7b3-4564-91a1-aca6b497fb1a';
const p = await api('PATCH', `/modules/${D}/records/${A}`, { data: [{ field: 'stage', value: { kind: 'null' } }] });
await page.setViewportSize({ width: 2200, height: 900 }); await page.reload({ waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 90; k++) { await sleep(1000); const t = await txt().catch(() => ''); if (t.includes('QA RT 2113 a') && t.includes('QA RT 2113 b')) break; } await sleep(2000);
return done({ patch: p.s });
