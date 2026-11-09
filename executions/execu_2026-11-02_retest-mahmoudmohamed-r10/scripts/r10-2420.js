// NDC-2420 + NDC-2659 on Anyware: workflow rules after blueprint transitions with and without During fields.
// QA blueprint on Leads lead_source: web -> referral (t0, no During fields) -> other (t1, required Email During field).
// R1 (lead_source changed, = referral): FieldUpdate description + SendPortalAccess (QA portal)  -> 2659 shape (N02)
// R2 (lead_source changed, = other): OwnerAssignment U1 + FieldUpdate lead_status            -> 2420 shape (owner hand-over)
const G = 'QA RT r10 2420';
const eq = (field, v) => ({ kind: 'Comparison', field, operator: 'Equal', value: { kind: 'string', stringValue: v } });
const out = {};
// portal
const pb = { name: 'QA RT r10 Portal', module_id: T.LEADS, layout_id: T.LEADS_STD, is_enabled: false, email_field_key: 'email', display_name_field_key: null, fields: [{ key: 'first_name', edit: false }, { key: 'phone', edit: true }],
  settings: { require_approval: false, language: 'en', temp_password_days: 7, idle_minutes: 30, captcha_on_login: false, branding: { logo_file_id: null, primary_color: '#2563eb', company_name: null, welcome_title: { en: null, ar: null }, welcome_text: { en: null, ar: null } }, access_condition: null, login_identifier: 'username', avatar_field_key: null, access_email: null, first_sign_in_update: null } };
const pc = await api('o', 'POST', '/record-portals', pb); const portal = pc.j?.data?.id; out.portal = pc.s + ' ' + (portal || pc.t.slice(0, 300));
if (!portal) return out; ledger(`record portal ${portal} "QA RT r10 Portal"`);
out.portalOn = (await api('o', 'PATCH', '/record-portals/' + portal, { is_enabled: true, row_version: pc.j.data.row_version })).s;
// blueprint
const st = (id, i, term) => ({ id, name: id, position: { x: 80 + 260 * i, y: 80 }, isTerminal: term });
const def = { name: 'QA RT r10 2420 BP', description: '', moduleKey: 'leads', layoutId: T.LEADS_STD, targetField: 'lead_source', continuous: false,
  entryCriteria: { op: 'startsWith', field: 'first_name', value: G },
  states: [st('web', 0, false), st('referral', 1, false), st('other', 2, true)],
  transitions: [
    { id: 't0', name: 'QA web to referral (no fields)', fromStateId: 'web', toStateId: 'referral', color: '#2563eb', before: {}, during: {}, after: { actions: [] } },
    { id: 't1', name: 'QA referral to other (required Email)', fromStateId: 'referral', toStateId: 'other', color: '#2563eb', before: {}, during: { requiredFields: [{ name: 'email', datatype: { key: 'email' }, required: true }] }, after: { actions: [] } }] };
const bc = await X.made('o', `/modules/${T.LEADS}/blueprints`, { isActive: false, definition: def }, 'blueprint'); const bp = bc.j?.data?.id; out.bp = bc.s + ' ' + (bp || bc.t.slice(0, 300));
if (!bp) return out;
const bon = await api('o', 'PUT', `/modules/${T.LEADS}/blueprints/${bp}`, { isActive: true, definition: def }); out.bpOn = bon.s + ' ' + (bon.s > 299 ? bon.t.slice(0, 300) : '');
// rules
const rule = async (name, value, actions) => {
  const body = X.wf(T.LEADS, name, G, { trigger: 'SpecificFieldChanged', fieldName: 'lead_source', actions, extra: eq('lead_source', value) });
  const r = await X.made('o', '/workflow/rules', body, 'workflow rule'); const id = r.j?.data?.id; if (!id) return r.s + ' ' + r.t.slice(0, 300);
  const a = await api('o', 'POST', `/workflow/rules/${id}/activate`); return { id, create: r.s, activate: a.s, err: a.s > 299 ? a.t.slice(0, 200) : undefined };
};
out.R1 = await rule('QA RT r10 2420 R1 after t0', 'referral', [X.fieldUpdate('description', 'QA r10 R1 ran'), { type: 'SendPortalAccess', portalId: portal, resend: false }]);
out.R2 = await rule('QA RT r10 2420 R2 after t1', 'other', [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: T.U1 }, X.fieldUpdate('lead_status', 'Contacted')]);
return out;
