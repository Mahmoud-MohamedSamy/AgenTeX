const out = {}; const names = ['import', 'imports', 'crm-import', 'import-wizard', 'records', 'crm-records', 'common', 'workflow', 'crm-workflow'];
for (const n of names) { const r = await page.context().request.get(H + `/locales/en/${n}.json`, { timeout: 60000 }).catch(() => null); if (!r || r.status() !== 200) continue; const t = await r.text(); if (!t.trim().startsWith('{')) continue; const hits = [...t.matchAll(/"[^"]*"\s*:\s*"([^"]*(Trigger|trigger)[^"]*)"/g)].map(m => m[1]).slice(0, 8); out[n] = hits; }
return done(out);
