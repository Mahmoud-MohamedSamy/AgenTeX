// G12: QA CRM web form on Leads / QA layout, CAPTCHA off, + rule on qa_vr_text
const mid = await modId(); const L = I.layout; const o = {};
const fld = k => ({ key: k, placeholder: null, label: null, required: false, hidden: false, default_value: null, help: null });
const def = { version: 2, language: 'en', success_message: 'QA VR1112 thank you', fields: [fld('first_name'), fld('qa_vr_text')], attachments: { enabled: false, screenshot_enabled: false, target_field_key: null, required: false, label: null }, captcha_enabled: false, launcher: null, allowed_origins: ['https://staging-crm.taviportal.com'], style: { font_family: 'system', font_size: 13, font_color: '#1F2937', background_color: '#FFFFFF', label_alignment: 'top', width_px: 600, submit_label: null, reset_label: null, show_form_name: false, field_columns: null }, redirect_url: null, default_owner_id: null, live_chat: false, share_link_enabled: false, owner: { mode: 'unassigned', user_id: null, assignment_rule_id: null, notify_owner: false, notify_email: false, notify_user_ids: [] }, duplicates: null, capture: null, acknowledgement: null, tags: null, consent: null, review: null, double_opt_in: null, related: null };
let w = await api('POST', '/web-forms', { kind: 'advanced_form', app_key: 'crm', name: P + ' G12 form', module_id: mid, layout_id: L, is_enabled: true, definition: def });
o.create = SR(w).slice(0, 400);
if (w.j && w.j.data) { I.wf = w.j.data.id; I.wfKey = w.j.data.embed_key; SAVE(); LED('web form ' + I.wf); }
const r = I.g12 ? { s: 'exists' } : await mkRule(mid, { name: P + ' G12 text', layoutId: L, primaryField: 'qa_vr_text', branches: [B(C('startsWith', 'qa_vr_text', 'BAD'), 'QA G12 text cannot start with BAD')] }); o.rule = SR(r).slice(0, 100); if (r.j && r.j.data) { I.g12 = r.j.data.id; SAVE(); }
o.key = I.wfKey ? 'len ' + I.wfKey.length : null;
return o;
