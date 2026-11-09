const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', id = 'a60da2df-a13c-4859-8322-eb3339d771c4'; const out = {};
await go(`/modules/${D}/records/${id}`, 5000); let i = 0; for (; i < 60 && !(await txt()).includes('QA RT r8 deal'); i++) await sleep(2000); out.waited = i * 2;
await sleep(4000); await shot('v3-deal-record');
out.page = (await txt()).split('\n').map(l => l.trim()).filter(l => l && l.length < 60).slice(0, 80).join(' | ');
return done(out);
