const out = {};
const r1 = await call('GET', `/search?q=${encodeURIComponent('QA W2 MD 001')}&limit=5`); out.deletedMD = (r1.j.data.groups[0].hits || []).map(h => h.title.text).slice(0, 5);
const r2 = await call('GET', `/search?q=${encodeURIComponent('QA W2 WF imp off')}&limit=5`); out.undoneImport = (r2.j.data.groups[0].hits || []).map(h => h.title.text).slice(0, 5);
const r3 = await call('GET', `/search?q=${encodeURIComponent('QA W2 UI lead')}&limit=5`); out.deletedUI = (r3.j.data.groups[0].hits || []).map(h => h.title.text).slice(0, 5);
const r4 = await call('GET', `/search?q=Q&limit=5`); out.oneChar = r4.s + ' ' + r4.t.slice(0, 150);
return out;
