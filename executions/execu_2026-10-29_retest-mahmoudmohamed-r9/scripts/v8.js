const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {};
const std = arr((await api('GET', `/modules/${D}/layouts`)).j?.data).find(l => l.name === 'Standard')?.id; out.std = std;
await go(`/modules/${D}?layout=${std}`, 5000); for (let j = 0; j < 45 && !(await txt()).includes('QA RT r8 deal'); j++) await sleep(2000); await sleep(2000); await shot('v8-deals-standard');
const t = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); const i = t.indexOf('QA RT r8 deal'); out.found = i >= 0; out.row = i >= 0 ? t.slice(i - 3, i + 6) : t.slice(0, 30);
out.rawIds = t.filter(l => /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(l)).slice(0, 3);
return done(out);
