R('TU-22', 'PASS', 'check "number > 10": 5 refused with the admin message "QA BP R must be more than 10", 20 runs. Note: the API also saves a check with an empty message (the designer flags it as incomplete), same class as CV-06');
const fields = L((await api('GET', `/modules/${T}/fields`)).j?.data);
const af = fields.find(f => (f.datatypeKey || f.datatype?.key) === 'address');
const out = { addrOptions: JSON.stringify(af.datatypeOptions || af).slice(0, 600) };
// TU-31 required-for (item must be required; rule narrows who must fill it)
const g = 'TU31' + uid();
const m = await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'comment', mandatory: true }], requiredFor: { comment: { userIds: [U.A], teamIds: [] } } } }), TR('end', 'Escalated', 'Closed')]));
if (m.ok) { const sd = (await getBp(m.id)).definition.transitions[0].during; const ta = await mkT(g, 'A'), tb = await mkT(g, 'B'); await waitIn(ta); await waitIn(tb);
  const rA = await runT(ta, 'go', 'Open', {}, A), rB = await runT(tb, 'go', 'Open', {}, B);
  R('TU-31', rA.s >= 400 && ok(rB) ? 'PASS' : 'FAIL', `required for Agent A only: A without comment → ${E(rA)}; B without → ${E(rB)}; stored ${JSON.stringify(sd.requiredFor)}`); }
else R('TU-31', 'FAIL', 'required-for not saved: ' + E(m.r));
// API-07 readable errors: schema mismatch text
const bad = await mkBp(DEF('API7' + uid(), S3(), [TR('go', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'comment', mandatory: true }], requiredFor: { comment: ['x'] } } }), TR('end', 'Escalated', 'Closed')]), false);
const bad2 = await mkBp({ ...BASIC('API7' + uid()), states: 'not-an-array' }, false);
const leak = [bad, bad2].map(x => x.r.j?.error?.details ? JSON.stringify(x.r.j.error.details) : '').join(' ');
R('API-07', /MetadataEngine|System\.|Path: \$/.test(leak) ? 'FAIL' : 'PASS', 'readable error codes (BLUEPRINT_NOT_OWNER, BLUEPRINT_CRITERIA_NOT_MET, BLUEPRINT_STATE_CHANGED, DESK_ITEM_REQUIRED… all seen with plain messages); but a body of the wrong shape returns: ' + leak.slice(0, 400));
RG('NDC-3069', 'PASS', 'malformed owner id now "Blueprint definition does not match the expected schema." — other wrong-shape fields still show .NET type names (API-07)');
await cleanup();
return out;
