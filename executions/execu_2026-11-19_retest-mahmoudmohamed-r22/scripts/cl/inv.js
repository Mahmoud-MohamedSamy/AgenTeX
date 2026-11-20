// Read-only inventory of round 18–23 test data ("QA RT18".."QA RT23") for APP=desk|crm. Writes ../out/inv-<app>.json
const RE = /QA RT(1[89]|2[0-3])/i; const APPK = process.env.APP; const out = { app: APPK, records: {}, cfg: {}, errors: [] };
const mn = m => m.apiName || (m.labels && m.labels.en) || m.moduleKey;const nm = x => (x.definition && x.definition.name) || x.name || x.title || x.display_name || x.subject || x.label || '';
const pick = (r) => { const d = r.j?.data; if (Array.isArray(d)) return d; return arr(d?.items || d?.records || d?.rules || d?.teams || d?.tags || d?.skills || d?.policies || d?.forms || d?.macros || d); };
// 1) records in every module, by search
const mods = arr((await api('GET', '/modules?app_key=' + APPK)).j?.data);
out.modules = mods.length;
for (const m of mods) {
  const ids = new Map();
  for (const q of ['QA RT18', 'QA RT19', 'QA RT20', 'QA RT21', 'QA RT22', 'QA RT23']) {
    for (let page = 1; page <= 30; page++) {
      const r = await api('GET', '/modules/' + m.id + '/records?q=' + encodeURIComponent(q) + '&per_page=200&page=' + page);
      if (r.s >= 300) { if (page === 1 && r.s !== 404) out.errors.push(mn(m) + ' q ' + r.s); break; }
      const L = pick(r); for (const x of L) { const t = JSON.stringify(x.data || x).slice(0, 4000); if (RE.test(t)) ids.set(x.id, (x.display_name || x.name || '').slice(0, 50)); }
      if (L.length < 200) break;
    }
  }
  if (ids.size) out.records[mn(m) + '|' + m.id] = [...ids.entries()];
}
// 2) config collections
const tryList = async (key, paths) => { for (const p of paths) { const r = await api('GET', p); if (r.s < 300) { const L = pick(r).filter(x => RE.test(nm(x))); out.cfg[key] = L.map(x => [x.id, nm(x).slice(0, 60), x.is_active ?? x.active ?? x.status ?? '']); return; } } out.cfg[key] = 'no list endpoint (' + paths.join(' | ') + ')'; };
if (APPK === 'desk') {
  await tryList('departments', ['/desk/departments?limit=500', '/desk/departments']);
  await tryList('teams', ['/desk/teams?limit=500', '/desk/teams']);
  await tryList('sla', ['/desk/sla/policies?limit=500', '/desk/sla/policies']);
  await tryList('macros', ['/desk/macros?limit=500', '/desk/macros']);
  await tryList('tags', ['/desk/tags?limit=500', '/desk/tags']);
  
  
  await tryList('templates', ['/desk/templates?limit=500', '/mail/templates?app_key=desk']);
  
  // skills per QA dept
  const deps = arr((await api('GET', '/desk/departments?limit=500')).j?.data);
  out.cfg.skills = []; out.cfg.skillTypes = []; out.cfg.assignmentRules = [];
  for (const d of deps) { for (const [k, p] of [['skills', '/desk/skills?department_id='], ['skillTypes', '/desk/skill-types?department_id='], ['assignmentRules', '/desk/assignment-rules?type=round_robin&department_id='], ['assignmentRules', '/desk/assignment-rules?type=direct&department_id=']]) { const L = pick(await api('GET', p + d.id)).filter(x => RE.test(nm(x))); for (const x of L) out.cfg[k].push([x.id, nm(x).slice(0, 60), d.name]); } }
}
out.cfg.workflowRules = []; for (const m of mods) { for (let page = 1; page <= 10; page++) { const r = await api('GET', '/workflow/rules?module_id=' + m.id + '&take=1000'); if (r.s >= 300) break; const L = pick(r); for (const x of L) if (RE.test(nm(x))) out.cfg.workflowRules.push([x.id, nm(x).slice(0, 60), mn(m), x.isActive ?? x.is_active ?? '']); break; } }
await tryList('webForms', ['/web-forms?app=' + APPK + '&limit=200']);
await tryList('wfAssign', ['/workflow/assignment-rules?app_key=' + APPK]);out.cfg.blueprints = []; out.cfg.mviews = out.cfg.mviews || [];for (const m of mods) { for (const [k, p] of [['blueprints', '/blueprints'], ['mviews', '/views']]) { const r = await api('GET', '/modules/' + m.id + p); if (r.s >= 300) continue; for (const x of pick(r)) if (RE.test(nm(x))) out.cfg[k].push([mn(m), x.id, nm(x).slice(0, 60), x.is_active ?? x.status ?? '']); } }
if (APPK === 'crm') {
  await tryList('globalSets', ['/global-sets?limit=500', '/global-sets']);
  await tryList('profiles', ['/iam/profiles?take=500']);
  // per-module layouts, fields, views, validation + layout rules
  out.cfg.layouts = []; out.cfg.fields = []; out.cfg.mviews = []; out.cfg.vrules = []; out.cfg.lrules = [];
  for (const m of mods) {
    for (const [k, p, f] of [['layouts', '/layouts', x => x.name], ['fields', '/fields?limit=300', x => (x.apiName || '') + ' ' + JSON.stringify(x.labels || '')], ['vrules', '/validation-rules', x => x.name], ['lrules', '/layout-rules', x => x.name]]) {
      const r = await api('GET', '/modules/' + m.id + p); if (r.s >= 300) continue;
      for (const x of pick(r)) { const n = f(x) || ''; if (RE.test(n) || (k === 'fields' && /^qa_rt(1[89]|2[0-3])/.test(x.apiName || ''))) out.cfg[k].push([mn(m), x.id, String(n).slice(0, 60)]); }
    }
  }
}
fs.writeFileSync('../out/inv-' + APPK + '.json', JSON.stringify(out, null, 1));
const sum = { records: Object.fromEntries(Object.entries(out.records).map(([k, v]) => [k.split('|')[0], v.length])), cfg: Object.fromEntries(Object.entries(out.cfg).map(([k, v]) => [k, Array.isArray(v) ? v.length : v])), errors: out.errors.slice(0, 8) };
return sum;
