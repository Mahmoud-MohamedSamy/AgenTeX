const out = {}; let i = 0; for (; i < 60 && /Loading…/.test(await txt()); i++) await sleep(2000); out.waited = i * 2; await sleep(3000);
await shot('v4-deal-overview');
const all = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); const k = all.findIndex(l => /^Pipeline$/i.test(l)); const s = all.findIndex(l => /^Stage$/i.test(l));
out.pipelineField = k >= 0 ? all.slice(k, k + 3) : 'no Pipeline label'; out.stageField = s >= 0 ? all.slice(s, s + 3) : 'no Stage label';
out.rawIds = all.filter(l => /5170500c|needs_analysis|closed_won/.test(l));
const pb = page.getByText(/^Pipeline$/i).first(); if (await pb.count()) { await pb.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800); await shot('v4-deal-pipeline-field'); }
await page.getByText(/^Timeline$/).first().click(); for (let j = 0; j < 30 && !/created/i.test(await txt()); j++) await sleep(2000); await shot('v4-deal-timeline');
out.timeline = (await txt()).split('\n').filter(l => /created/i.test(l)).slice(0, 4);
return done(out);
