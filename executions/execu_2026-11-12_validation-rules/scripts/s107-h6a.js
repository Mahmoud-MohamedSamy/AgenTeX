// owner: rule note must not be empty + field permission for profile User (mode from env FPM)
const mid = await modId(); const L = I.layout; const PROF = process.env.PROFID || '11111111-1111-1111-1111-111111111103'; const o = {};
if (!I.h6) { const r = await mkRule(mid, { name: P + ' H6 note required', layoutId: L, primaryField: 'qa_vr_note', branches: [B(C('isEmpty', 'qa_vr_note'), 'QA H6 note is required')] }); o.rule = SR(r).slice(0, 150); if (r.j && r.j.data) { I.h6 = r.j.data.id; SAVE(); } }
const fp = await api('POST', '/modules/' + mid + '/field-permissions', { fieldId: I.fields.qa_vr_note, profileId: PROF, permission: process.env.FPM });
o.fp = SR(fp).slice(0, 250); if (fp.j && fp.j.data) { I.h6fp = fp.j.data.id; SAVE(); LED('field permission ' + process.env.FPM + ' ' + fp.j.data.id); }
const own = await mkRec(mid, { ...I.base, last_name: P + ' H6 owner' }, L); o.owner = own.s + ' ' + own.err.slice(0, 120);
return o;
