const mid = await modId(); const lid = I.layout; const out = {};
const rec = (await api('GET','/modules/'+mid+'/records/'+I.G2)).j.data; const ow = rec.data.find(d=>d.field==='owner'); out.owner = JSON.stringify(ow);
const uid = ow.value.value || (ow.value.ref && ow.value.ref.id) || ow.value.id;
const r = await mkRule(mid, { name: P+' user', layoutId: lid, primaryField:'owner', branches:[ br(eq('owner', uid), [show(['qa_lr_reason'])]) ] }); out.mk = SR(r).slice(0,300); if (r.j.data) { I.ruser = r.j.data.id; SAVE(); }
return out;
