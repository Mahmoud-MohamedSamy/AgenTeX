const o = {};
ST.PROTECTED = ['86d7ce3c-e3c4-57ae-80ac-fe9275dd91a6', '5de6c60b-9fb6-50eb-a9a7-ea27f279d22c'];
if (!ST.D1) { const r = await api.O('POST', '/desk/departments', { name: 'QA PA Dept 1', description: 'QA PA NDC-2871 retest, delete after', visibility: 'private', agent_user_ids: [U.O, U.A, U.B, U.D] }); o.d1 = E(r); ST.D1 = r.j?.data?.id; if (ST.D1) ledger('department QA PA Dept 1 ' + ST.D1); }
if (!ST.D2) { const r = await api.O('POST', '/desk/departments', { name: 'QA PA Dept 2', description: 'QA PA NDC-2871 retest, delete after', visibility: 'private', agent_user_ids: [U.O, U.S] }); o.d2 = E(r); ST.D2 = r.j?.data?.id; if (ST.D2) ledger('department QA PA Dept 2 ' + ST.D2); }
saveState();
if (!ST.TEAM) { const r = await api.O('POST', '/desk/teams', { name: 'QA PA Team', description: 'QA PA NDC-2871, delete after', department_id: ST.D1, sources: [{ kind: 'agent', ref_id: U.D }], color: 'blue', icon: 'star' }); o.team = E(r); ST.TEAM = r.j?.data?.id; if (ST.TEAM) ledger('team QA PA Team ' + ST.TEAM); }
saveState();
const tf = await api.O('GET', `/web-forms/${TECH_FORM}`); const tech = tf.j?.data; o.techKeys = Object.keys(tech || {});
if (!ST.FORM && tech) {
  const def = JSON.parse(JSON.stringify(tech.definition)); def.review = { mode: 'approval', spam_threshold: 90, approver_ids: [U.B], approver_team_ids: [ST.TEAM] }; def.allowed_origins = []; def.captcha_enabled = false;
  const r = await api.O('POST', '/web-forms', { kind: tech.kind, name: 'QA PA Form', department_id: ST.D1, layout_id: tech.layout_id, module_id: tech.module_id, definition: def, app_key: 'desk' });
  o.form = E(r); ST.FORM = r.j?.data?.id; ST.FORM_KEY = r.j?.data?.embed_key; if (ST.FORM) ledger('web form QA PA Form ' + ST.FORM);
  if (ST.FORM) { const en = await api.O('POST', `/web-forms/${ST.FORM}/enable`); o.enable = E(en); }
  ST.FORM_FIELDS = (def.fields || []).map(f => f.key);
}
saveState();
for (let i = 1; i <= 12; i++) { const s = 'QA PA T' + String(i).padStart(2, '0'); if (!ST.tickets?.[s]) { const r = await mkTicket('O', s, { priority: i % 3 === 0 ? 'high' : 'medium' }); if (!r.id) o['t' + i] = r.s + ' ' + r.err; } }
for (const i of [21, 22]) { const s = 'QA PA T' + i; if (!ST.tickets?.[s]) { const r = await mkTicket('O', s, { department: ST.D2 }); if (!r.id) o['t' + i] = r.s + ' ' + r.err; } }
o.state = { D1: ST.D1, D2: ST.D2, TEAM: ST.TEAM, FORM: ST.FORM, key: !!ST.FORM_KEY, fields: ST.FORM_FIELDS, tickets: Object.keys(ST.tickets || {}).length };
return o;
