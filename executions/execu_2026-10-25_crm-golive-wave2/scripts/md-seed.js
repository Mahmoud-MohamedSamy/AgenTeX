const L = 'bf971461-2edc-45f2-b6e4-6e180aa64288', s = v => ({ kind: 'string', value: v });
const ids = []; const errs = [];
const one = async i => { const n = 'QA W2 MD ' + String(i).padStart(3, '0'); const r = await call('POST', `/modules/${MODS.leads}/records`, { layout_id: L, data: [{ field: 'first_name', value: s(n) }, { field: 'phone', value: s('0101' + String(2000000 + i).slice(0, 7)) }, { field: 'single_line_3_9', value: s('QA W2') }] }); if (r.s < 300) ids.push(r.j.data.id); else errs.push(r.s + ' ' + r.t.slice(0, 100)); };
for (let b = 0; b < 120; b += 10) await Promise.all(Array.from({ length: 10 }, (_, k) => one(b + k + 1)));
return { n: ids.length, errs: errs.slice(0, 3), ids };
