const trial = async (url, okRe, stuckRe) => { const calls = []; const f = r => { const u = r.url(); if (u.includes('/api/v1/modules')) calls.push(u.replace(API, '').slice(0, 60)); }; page.on('request', f);
  await page.goto(H + url, { waitUntil: 'commit' }); let st = 'timeout'; for (let i = 0; i < 25; i++) { await sleep(1000); const t = await page.locator('body').innerText().catch(() => ''); if (okRe.test(t)) { st = 'ok@' + (i + 1) + 's'; break; } if (stuckRe && stuckRe.test(t) && i > 15) { st = 'stuck: ' + t.match(stuckRe)[0]; break; } }
  page.off('request', f); return st + ' | ' + [...new Set(calls)].join(', '); };
const out = { pipelines: [], leadsImport: [], dealsImport: [] };
for (let k = 0; k < 3; k++) out.pipelines.push(await trial('/settings/pipelines', /Add Stages/, /Loading board/));
for (let k = 0; k < 3; k++) out.leadsImport.push(await trial('/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/import', /Upload your file|You have an import in progress/, /don't have access to CRM/));
for (let k = 0; k < 2; k++) out.dealsImport.push(await trial('/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/import', /Upload your file|You have an import in progress/, /don't have access to CRM/));
return done(out);
