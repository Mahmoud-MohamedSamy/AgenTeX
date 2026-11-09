const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {};
await go(`/modules/${D}/`, 5000); for (let j = 0; j < 60 && !(await txt()).includes('QA RT r8 deal'); j++) await sleep(2000); await sleep(3000);
await shot('v6-deals-list');
const t = (await txt()).split('\n').map(l => l.trim()).filter(Boolean);
out.headers = t.filter(l => /^(Pipeline|Stage|Deal Name|Name|Amount)$/i.test(l)).slice(0, 10);
out.rawIds = t.filter(l => /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(l)).slice(0, 5);
out.stageVals = t.filter(l => /needs_analysis|closed_won|Needs Analysis|Qualification|qualification|Closed Won|test-01/.test(l)).slice(0, 10);
out.pipelineVals = t.filter(l => /^Standard|^1$/.test(l)).slice(0, 10);
return done(out);
