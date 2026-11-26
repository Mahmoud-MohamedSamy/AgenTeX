// TU-31 with the designer's key format; TU-20 with the real address subfields.
const an = 'qa_rt18_address'; const val = { street: 'QA BP R 5 Nile St', city: 'Giza', state: 'Giza', zip: '12611', country: 'Egypt' };
const probe = await mkT('ADDR' + uid(), 'shape'); const pe = await setF(probe, { [an]: val }); const s0 = (await flds(probe))[an];
const g2 = 'TU20' + uid(); const m2 = await mkBp(DEF(g2, S3(), [TR('go', 'Open', 'Escalated', { during: { requiredFields: [{ name: an, required: true, datatype: { key: 'address' } }] } }), TR('end', 'Escalated', 'Closed')]));
const t2 = await mkT(g2); await waitIn(t2); const r = await runT(t2, 'go', 'Open', { fields: { [an]: val } }); await sleep(1500); const sv = (await flds(t2))[an];
R('TU-20', ok(r) && JS(sv || '').includes('Giza') ? 'PASS' : 'FAIL', `address: normal edit → ${E(pe)} stores ${JS(s0).slice(0, 90)}; through a transition → ${E(r)} stores ${JS(sv).slice(0, 90)}`);
return await cleanup();
