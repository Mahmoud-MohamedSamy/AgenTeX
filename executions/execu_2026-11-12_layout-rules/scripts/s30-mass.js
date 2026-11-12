const mid = await modId(); const lid = I.layout;
const a = await mkRec(mid, { first_name: P + ' mass1', qa_lr_type: 'Question' }, lid); const b = await mkRec(mid, { first_name: P + ' mass2', qa_lr_type: 'Question' }, lid);
const bodies = [{ record_ids: [a.id, b.id], data: [{ field: 'qa_lr_type', value: enc('Refund') }] }, { record_ids: [a.id, b.id], data: { qa_lr_type: enc('Refund') } }, { record_ids: [a.id, b.id], data: { qa_lr_type: 'Refund' } }];
const out = []; for (const body of bodies) { const r = await api('POST', '/modules/' + mid + '/records/mass-update', body); out.push(SR(r).slice(0, 400)); if (r.s < 300) break; }
const g = (await api('GET', '/modules/' + mid + '/records/' + a.id)).j; const t = (g?.data?.data || []).find(x => x.field === 'qa_lr_type');
return { out, typeAfter: t?.value?.value };
