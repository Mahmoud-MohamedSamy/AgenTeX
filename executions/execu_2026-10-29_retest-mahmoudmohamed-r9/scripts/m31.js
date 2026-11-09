// Reversible: QA AEO Layout SB/SC/SE/SF on Transactions (our test run's copies) back to access "all_users"; the QA SE deal I created is removed.
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {};
out.delMyDeal = (await api('DELETE', `/modules/${D}/records/e1ee141f-4fa8-411a-ba65-315ec8584bb4`)).s;
const lays = arr((await api('GET', `/modules/${D}/layouts`)).j?.data).filter(l => /^QA AEO Layout S[BCEF]$/.test(l.name));
for (const l of lays) { const g = (await api('GET', `/modules/${D}/layouts/${l.id}`)).j?.data; const b = { ...g, accessMode: 'all_users', assignedProfiles: [] }; delete b.id; out[l.name + ' ' + l.id] = (await api('PUT', `/modules/${D}/layouts/${l.id}`, b)).s; }
return done(out);
