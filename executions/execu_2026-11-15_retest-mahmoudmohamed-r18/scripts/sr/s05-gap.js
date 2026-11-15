const out = {}; const keep = x => x.j && x.j.data && x.j.data.id;
const lays = arr((await api('GET', '/modules/' + L + '/layouts')).j.data); const std = lays.find(x => /standard/i.test(x.name)) || lays[0]; out.layouts = lays.map(x => x.name).join(', ');
let r = await mkRule({ name: P + 'Z1 layout', layout_id: std.id, layoutId: std.id, entries: [ent('lead_source', 'eq', 'web', 1)] }); out.Z1 = SR(r) + ' stored keys: ' + (keep(r) ? Object.keys(r.j.data).join(',') : '');
r = await mkRule({ name: P + 'Z2 criteria', criteria: { field_key: 'lead_source', operator: 'eq', value: 'web' }, record_criteria: [{ field_key: 'lead_source', operator: 'eq', value: 'web' }], entries: [ent('company', 'isNotNull', undefined, 1)] }); out.Z2 = SR(r) + (keep(r) ? ' keys ' + Object.keys(r.j.data).join(',') : '');
r = await mkRule({ name: P + 'Z3 multi', entries: [{ conditions: [{ field_key: 'lead_source', operator: 'eq', value: 'web' }, { field_key: 'company', operator: 'isNotNull' }], pattern: '1 and 2', points: 2 }] }); out.Z3 = SR(r) + (keep(r) ? ' ' + JSON.stringify(r.j.data.entries).slice(0, 300) : '');
const nums = (await fieldsOf(L)).filter(x => /number|integer|currency|decimal/.test(x.datatypeKey)).map(x => x.fieldName); const dates = (await fieldsOf(L)).filter(x => /date/.test(x.datatypeKey)).map(x => x.fieldName + ':' + x.datatypeKey);
out.numFields = nums.slice(0, 5).join(','); out.dateFields = dates.slice(0, 6).join(',');
const nf = nums.find(x => /employ/.test(x)) || nums[0]; const df = (dates.find(x => /date$/.test(x)) || dates[0]).split(':')[0];
out.Z4 = [];
for (const [fk, op, v] of [[nf, 'between', [1, 5]], [nf, 'notBetween', [1, 5]], [df, 'between', ['2026-01-01', '2026-12-31']], [df, 'today', undefined], [df, 'currentMonth', undefined], [df, 'inLastDays', 7], [df, 'eq', '${TODAY}'], ['lead_source', 'contains', 'we'], ['lead_source', 'startsWith', 'we']]) { const x = await mkRule({ name: P + 'Z4 ' + op + ' ' + fk, entries: [ent(fk, op, v, 1)] }); out.Z4.push(fk + ' ' + op + ' -> ' + SR(x).slice(0, 200)); }
r = await mkRule({ name: P + 'Z5 touch', entries: [{ kind: 'touch_point', channel: 'email', event: 'opened', points: 2 }] }); out.Z5 = SR(r).slice(0, 250);
r = await mkRule({ name: P + 'Z7 30', entries: Array.from({ length: 30 }, (_, i) => ent('company', 'eq', 'c' + i, 1)) }); out.Z7_30 = SR(r).slice(0, 200);
r = await mkRule({ name: P + 'Z7 26', entries: Array.from({ length: 26 }, (_, i) => ent('company', 'eq', 'c' + i, 1)) }); out.Z7_26 = SR(r).slice(0, 200);
// base rule for score-keeping checks
r = await mkRule({ name: P + 'Z base', entries: [ent('company', 'eq', 'QA RT18 Z co', 7)] }); const base = keep(r);
const old = await mkRec({ last_name: P + 'Z old', company: 'QA RT18 Z oldco' });
const r2 = await mkRule({ name: P + 'Z8 old', entries: [ent('company', 'eq', 'QA RT18 Z oldco', 6)] }); const z8 = keep(r2); await sleep(5000);
out.Z8_oldRecordScoreAfterNewRule = await score(old.id);
const paths = [['POST', '/scoring-rules/' + base + '/clone'], ['POST', '/scoring-rules/' + base + '/duplicate'], ['POST', '/scoring-rules/recalculate'], ['POST', '/scoring-rules/' + base + '/run'], ['POST', '/scoring-rules/run'], ['GET', '/scoring-rules/stats'], ['GET', '/scoring-rules/export'], ['POST', '/scoring-rules/' + base + '/activate'], ['POST', '/scoring-rules/' + base + '/deactivate'], ['GET', '/modules/' + L + '/records/' + old.id + '/scores'], ['GET', '/modules/' + L + '/records/' + old.id + '/scoring']];
out.Z16 = []; for (const [m, p] of paths) { const x = await api(m, p, m === 'POST' ? {} : undefined); out.Z16.push(m + ' ' + p.replace(/[0-9a-f-]{36}/g, '{id}') + ' -> ' + SR(x).slice(0, 140)); }
const rec = await mkRec({ last_name: P + 'Z keep', company: 'QA RT18 Z co' }); out.Z12_score0 = await score(rec.id);
const off = await api('PATCH', '/scoring-rules/' + base + '/active', { is_active: false }); await sleep(3000); out.Z12_offNoSave = await score(rec.id);
await updRec(rec.id, { first_name: 'QA z12' }); out.Z12_offAfterSave = await score(rec.id);
await api('PATCH', '/scoring-rules/' + base + '/active', { is_active: true }); await updRec(rec.id, { first_name: 'QA z13' }); out.Z13_onAgain = await score(rec.id);
const del = await api('DELETE', '/scoring-rules/' + base); await sleep(4000); out.Z13_afterDeleteNoSave = SR(del) + ' score ' + await score(rec.id);
const rv = await recVals(rec.id); out.recScoreKeys = Object.keys(rv).filter(k => /score/i.test(k)).join(',');
out.ruleKeys = Object.keys((await getRule(z8)).j.data).join(',');
I.gap = { old: old.id, rec: rec.id, z8 }; SAVE();
return out;
