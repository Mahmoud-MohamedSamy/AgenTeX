const o = {}; const r = await updRec(I.C, { score: 999 }); o.writeScore = r.s + ' ' + r.err; o.C_after = await score(I.C);
const imp = await api('POST', '/modules/' + L + '/records', { data: Object.entries({ first_name: 'QA', last_name: P + 'H setscore', company: 'QA RT20 SC ctl', no_of_employees: 50, score: 500 }).map(([k, v]) => ({ field: k, value: enc(v) })) }); o.createWithScore = SR(imp).slice(0, 160); const hid = imp.j && imp.j.data && imp.j.data.id; if (hid) { LED('record "QA RT20 SC H setscore" ' + hid + ' (Leads)'); I.H = hid; SAVE(); o.H = await score(hid); }
return o;
