const LE = await mkRec({ last_name: P + 'E old', company: 'QA RT20 SC old', no_of_employees: 50 }); I.E = LE.id;
const LF = await mkRec({ last_name: P + 'F old', company: 'QA RT20 SC old2', no_of_employees: 50 }); I.F = LF.id; SAVE();
return { E: LE.s, F: LF.s, sE: await score(LE.id), sF: await score(LF.id), sC: await score(I.C) };
