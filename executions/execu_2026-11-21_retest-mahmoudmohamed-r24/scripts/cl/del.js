// Deletes round 18–23 test data listed in ../out/inv-<app>.json and ../out/inv-views-<app>.json (APP=desk|crm).
// Order: automation → views → forms → records (mass delete) → structure. Logs every call to ../out/del-<app>.json and the ledger.
const APPK = process.env.APP; const inv = JSON.parse(fs.readFileSync('../out/inv-' + APPK + '.json', 'utf8'));
const views = JSON.parse(fs.readFileSync('../out/inv-views-' + APPK + '.json', 'utf8'));
const OUTF = '../out/del-' + APPK + '.json'; const res = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
const mods = arr((await api('GET', '/modules?app_key=' + APPK)).j?.data); const modId = n => (mods.find(m => m.apiName === n) || {}).id;
const uniq = (L, i = 0) => [...new Map((Array.isArray(L) ? L : []).map(x => [x[i], x])).values()];
const D = async (grp, key, m, p, b) => { res[grp] = res[grp] || {}; if (res[grp][key] && res[grp][key] < 300) return; const r = await api(m, p, b); res[grp][key] = r.s; if (r.s >= 300 && r.s !== 404) (res.fail = res.fail || []).push(grp + ' ' + key + ' ' + r.s + ' ' + String(r.t).slice(0, 140)); };
const step = async (grp, fn) => { if (only && !only.includes(grp)) return; await fn(); fs.writeFileSync(OUTF, JSON.stringify(res, null, 1)); };
await step('workflowRules', async () => { for (const [id, n] of uniq(inv.cfg.workflowRules)) await D('workflowRules', id, 'DELETE', '/workflow/rules/' + id); });
await step('assignmentRules', async () => { for (const [id] of uniq(inv.cfg.assignmentRules)) await D('assignmentRules', id, 'DELETE', '/desk/assignment-rules/' + id); });
await step('blueprints', async () => { for (const [mn, id] of uniq(inv.cfg.blueprints, 1)) { const M = modId(mn); await api('PATCH', '/modules/' + M + '/blueprints/' + id, { isActive: false }); await D('blueprints', id, 'DELETE', '/modules/' + M + '/blueprints/' + id); } });
await step('sla', async () => { for (const [id] of uniq(inv.cfg.sla)) await D('sla', id, 'DELETE', '/desk/sla/policies/' + id); });
await step('vrules', async () => { for (const [mn, id] of uniq(inv.cfg.vrules, 1)) await D('vrules', id, 'DELETE', '/modules/' + modId(mn) + '/validation-rules/' + id); });
await step('lrules', async () => { for (const [mn, id] of uniq(inv.cfg.lrules, 1)) await D('lrules', id, 'DELETE', '/modules/' + modId(mn) + '/layout-rules/' + id); });
await step('skills', async () => { for (const [id] of uniq(inv.cfg.skills)) await D('skills', id, 'DELETE', '/desk/skills/' + id); });
await step('tags', async () => { for (const [id] of uniq(inv.cfg.tags)) await D('tags', id, 'DELETE', '/desk/tags/' + id); });
await step('views', async () => { for (const [mn, M, id] of views) await D('views', id, 'DELETE', '/modules/' + M + '/views/' + id); });
await step('webForms', async () => { for (const [id] of uniq(inv.cfg.webForms)) await D('webForms', id, 'DELETE', '/web-forms/' + id); });
await step('globalSets', async () => { for (const [id] of uniq(inv.cfg.globalSets)) await D('globalSets', id, 'DELETE', '/global-sets/' + id); });
await step('records', async () => {
  for (const [k, L] of Object.entries(inv.records)) {
    const M = k.split('|')[1]; const ids = L.map(x => x[0]);
    for (let i = 0; i < ids.length; i += 100) {
      const chunk = ids.slice(i, i + 100); const key = M.slice(0, 8) + '#' + i; res.records = res.records || {}; if (res.records[key] && res.records[key] < 300) continue;
      const r = await api('POST', '/modules/' + M + '/records/mass-delete', { record_ids: chunk, background: false }); res.records[key] = r.s;
      if (r.s >= 300) { let ok = 0; for (const id of chunk) { const d = await api('DELETE', '/modules/' + M + '/records/' + id); if (d.s < 300 || d.s === 404) ok++; } res.records[key] = ok === chunk.length ? 207 : r.s; if (ok !== chunk.length) (res.fail = res.fail || []).push('records ' + k.split('|')[0] + ' ' + (chunk.length - ok) + ' not deleted'); }
      fs.writeFileSync(OUTF, JSON.stringify(res, null, 1));
    }
  }
});
await step('layouts', async () => { for (const [mn, id] of uniq(inv.cfg.layouts, 1)) await D('layouts', id, 'DELETE', '/modules/' + modId(mn) + '/layouts/' + id); });
await step('fields', async () => { for (const [mn, id] of uniq(inv.cfg.fields, 1)) await D('fields', id, 'DELETE', '/modules/' + modId(mn) + '/fields/' + id); });
await step('profiles', async () => { const ps = arr((await api('GET', '/iam/profiles?take=500')).j?.data).filter(x => /^QA RT(1[89]|2[0-3])/.test(x.name)); for (const p of ps) await D('profiles', p.profileId || p.id, 'DELETE', '/iam/profiles/' + (p.profileId || p.id)); });
await step('teams', async () => { for (const [id] of uniq(inv.cfg.teams)) await D('teams', id, 'DELETE', '/desk/teams/' + id); });
await step('departments', async () => { for (const [id] of uniq(inv.cfg.departments)) await D('departments', id, 'DELETE', '/desk/departments/' + id); });
fs.appendFileSync('../ledger.md', '- ' + new Date().toISOString().slice(0, 19) + 'Z CLEANUP ' + APPK + (only ? ' [' + only.join(',') + ']' : '') + ': ' + Object.entries(res).filter(([k]) => k !== 'fail').map(([k, v]) => k + ' ' + Object.values(v).filter(s => s < 300 || s === 404).length + '/' + Object.keys(v).length).join(', ') + '; fails ' + (res.fail || []).length + '\n');
return { summary: Object.fromEntries(Object.entries(res).filter(([k]) => k !== 'fail').map(([k, v]) => [k, Object.values(v).filter(s => s < 300 || s === 404).length + '/' + Object.keys(v).length])), fail: (res.fail || []).slice(0, 25) };
