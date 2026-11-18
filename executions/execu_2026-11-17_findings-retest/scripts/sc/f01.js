const o = { t0: new Date().toISOString() }; const id = r => r.j && r.j.data && r.j.data.id;
const CO = 'QA RT21 SC co';
let r = await mkRule({ name: P + 'R1 rpt', description: 'QA RT21 lane SC F05', entries: [ent('company', 'eq', CO, 10)] }); o.R1 = SR(r); I.R1 = id(r); SAVE();
const A = await mkRec({ last_name: P + 'A', company: CO }); const C = await mkRec({ last_name: P + 'ctl', company: 'QA RT21 SC other' });
I.A = A.id; I.C = C.id; SAVE();
await sleep(2000); o.sA = await score(A.id); o.sC = await score(C.id);
return o;
