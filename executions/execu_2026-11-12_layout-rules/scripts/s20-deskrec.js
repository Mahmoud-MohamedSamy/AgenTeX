const mid = await modId(); const lid = I.layout; const HR = '08fd8684-c5c0-4d4d-86f9-2be70cf61e53', CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const F = await fieldsOf(mid); const reqF = F.filter(f => f.required).map(f => f.fieldName);
const contacts = arr((await api('GET', '/modules/' + (await modId('desk_contacts')) + '/records?limit=1')).j?.data);
const cid = contacts[0]?.id;
const a = await mkRec(mid, { subject: P + ' G16 HR', department: HR, contact_id: cid, qa_lr_vip: true, status: 'Open', qa_lr_date: '2026-11-12' }, lid);
const b = await mkRec(mid, { subject: P + ' G16 CS', department: CS, contact_id: cid, qa_lr_vip: true, status: 'Open', qa_lr_date: '2026-11-12' }, lid);
I.G16hr = a.id; I.G16cs = b.id; SAVE();
return { reqF, cid: !!cid, a: a.s + ' ' + a.err, b: b.s + ' ' + b.err };
