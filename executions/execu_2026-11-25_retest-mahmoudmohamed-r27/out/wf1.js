const D1 = 'a373cfd1-85e8-495d-af9a-1a003d2a08a3';
const all = []; for (let skip = 0; skip < 2000; skip += 100) { const a = arr((await api.O('GET', `/workflow/rules?moduleId=${T}&take=100&skip=${skip}`)).j?.data); all.push(...a); if (a.length < 100) break; }
const inD1 = all.filter(r => (r.departmentIds || []).includes(D1)); const noDept = all.filter(r => !(r.departmentIds || []).length);
return { inD1: inD1.length, noDept: noDept.length, both: inD1.length + noDept.length, sampleNoDept: noDept.slice(0, 3).map(r => r.name) };
