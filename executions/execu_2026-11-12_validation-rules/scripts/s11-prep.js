const mid = await modId(); const L = I.layout; const out = {};
for (const r of await rules(mid)) if ([P + ' E6 fv', P + ' E2 top'].includes(r.name)) await delRule(mid, r.id);
const a = await mkRule(mid, { name: P + ' E6 fv', layoutId: L, primaryField: 'qa_vr_phone', fieldVerification: true, branches: [B(C('regexNotMatches', 'qa_vr_phone', String.raw`\+20\d{10}`), 'QA E6 phone must be +20 and 10 digits')] });
const b = await mkRule(mid, { name: P + ' E2 top', layoutId: L, primaryField: 'qa_vr_email', errorPlacement: 'top', branches: [B(C('endsWith', 'qa_vr_email', '@bad.com'), 'QA E2 no bad.com emails')] });
out.fv = SR(a).slice(0, 200); out.top = SR(b).slice(0, 200); out.fvMode = a.j && a.j.data && a.j.data.mode; return out;
