const mid = await modId(); const o = {}; const FID = 'bef21b34-967d-4d8f-b858-3ffecfc1795f'; const PROF = '11111111-1111-1111-1111-111111111103';
const before = arr((await api('GET', '/modules/' + mid + '/field-permissions')).j.data).filter(x => x.fieldId === FID); o.before = before.map(x => x.profileId + ':' + x.permission);
const fp = await api('POST', '/modules/' + mid + '/field-permissions', { fieldId: FID, profileId: PROF, permission: 'hidden' }); o.fp = SR(fp).slice(0, 200);
if (fp.j && fp.j.data) { I.fp2985 = fp.j.data.id; SAVE(); LED('field permission qa_rt18_date hidden for profile User ' + fp.j.data.id + ' (Leads) — before: none'); }
const u = await updRec(mid, I.r2985, { qa_rt18_date: '2026-05-01' }); o.patch = u.s + ' ' + u.err.slice(0, 200);
const v = await recVals(mid, I.r2985); o.ownerSees = v.qa_rt18_date;
return o;
