// Round 2 Wave 4 batch 1 (owner session): QA lead, template with an unknown placeholder, two web forms, portal, reminder task, notifications.
const s = v => ({ kind: 'string', value: v });
const T = Date.now() % 100000, P = 'QA R2W4 ';
const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7', LAY = 'bf971461-2edc-45f2-b6e4-6e180aa64288';
const out = { created: {} };
// lead
const L = await call('POST', `/modules/${MODS.leads}/records`, { layout_id: LAY, data: [{ field: 'first_name', value: s(P + 'mail ' + T) }, { field: 'phone', value: s('0101' + String(1000000 + T).slice(0, 7)) }, { field: 'single_line_3_9', value: s('QA R2W4') }, { field: 'email', value: s('mahmoud.mmohamedsamy@gmail.com') }, { field: 'company', value: s('QA R2W4 Co') }] });
out.lead = L.s; out.created.lead = L.j && L.j.data && L.j.data.id;
// template with an unknown placeholder (NDC-2631)
const tp = await call('POST', '/mail/templates', { name: P + 'Template ' + T, subject: 'Hello {{recipient_name}}', body_html: '<p>Thanks for visiting us at {{company_name}}.</p><p>{{sender_name}}</p>', access: 'everyone' });
out.templateUnknown = tp.s + ' ' + tp.t.slice(0, 400); out.created.template = tp.j && tp.j.data && tp.j.data.id;
const tp2 = await call('POST', '/mail/templates', { name: P + 'Template ok ' + T, subject: 'Hello {{recipient_name}}', body_html: '<p>Hi {{recipient_name}}, today is {{today}}.</p><p>{{sender_name}}</p>', access: 'everyone' });
out.templateOk = tp2.s + ' ' + tp2.t.slice(0, 200); out.created.template2 = tp2.j && tp2.j.data && tp2.j.data.id;
// web forms
const wf = (name, captcha) => ({ kind: 'advanced_form', name, department_id: null, layout_id: LAY, module_id: MODS.leads, app_key: 'crm', definition: { version: 2, language: 'en', success_message: 'Thank you. Your request has been submitted.', fields: ['first_name', 'phone', 'email', 'company'].map(k => ({ key: k, placeholder: null, label: null, help: null })), attachments: { enabled: false, screenshot_enabled: false }, captcha_enabled: captcha, launcher: null, allowed_origins: [], style: { font_family: 'system', font_size: 13, font_color: '#1F2937', background_color: '#FFFFFF', label_alignment: 'top', width_px: 600, submit_label: null, reset_label: null, show_form_name: false }, redirect_url: null, owner: { mode: 'user', user_id: OWNER, assignment_rule_id: null, notify_owner: false, notify_email: false, notify_user_ids: [] }, share_link_enabled: true, capture: null, duplicates: null, live_chat: false } });
const f1 = await call('POST', '/web-forms', wf(P + 'Form ' + T, false)); out.form = f1.s + ' ' + f1.t.slice(0, 600); out.created.form = f1.j && f1.j.data && f1.j.data.id;
const f2 = await call('POST', '/web-forms', wf(P + 'Form captcha ' + T, true)); out.formCaptcha = f2.s + ' ' + f2.t.slice(0, 200); out.created.formCaptcha = f2.j && f2.j.data && f2.j.data.id;
// portal
const pt = await call('POST', '/record-portals', { name: P + 'Portal ' + T, module_id: MODS.leads, layout_id: LAY, is_enabled: false, email_field_key: 'email', display_name_field_key: null, fields: [{ key: 'first_name', edit: false }, { key: 'phone', edit: true }], settings: { require_approval: false, language: 'en', temp_password_days: 7, idle_minutes: 30, captcha_on_login: false, branding: { logo_file_id: null, primary_color: '#2563eb', company_name: null, welcome_title: { en: null, ar: null }, welcome_text: { en: null, ar: null } }, access_condition: null, login_identifier: 'username', avatar_field_key: null, access_email: null, first_sign_in_update: null } });
out.portal = pt.s + ' ' + pt.t.slice(0, 600); out.created.portal = pt.j && pt.j.data && (pt.j.data.id || (pt.j.data.portal && pt.j.data.portal.id));
// reminder task: due in 8 min, reminder 5 min before
const due = new Date(Date.now() + 8 * 60000); due.setSeconds(0, 0);
const tk = await call('POST', `/modules/${MODS.tasks}/records`, { layout_id: '40c084f2-f062-45d5-ac70-132a7597fac0', data: [{ field: 'name', value: s(P + 'Reminder ' + T) }, { field: 'subject', value: s(P + 'Reminder ' + T) }, { field: 'status', value: s('Not Started') }, { field: 'due_date', value: s(due.toISOString().replace('.000', '')) }, { field: 'reminder_offset_minutes', value: s('5') }] });
out.task = tk.s + ' ' + tk.t.slice(0, 200); out.created.task = tk.j && tk.j.data && tk.j.data.id; out.taskDue = due.toISOString();
// notifications (owner)
const n = await call('GET', '/notifications?limit=10'); out.notifList = n.s + ' ' + (n.j && JSON.stringify((n.j.data && (n.j.data.data || n.j.data.items || n.j.data)) || '').slice(0, 600));
const pr = await call('GET', '/notifications/preferences/me');
const keys = JSON.stringify(pr.j).match(/"(label|name|title|event_type|key)":"[^"]+"/g) || [];
out.prefsRawKeys = [...new Set(keys)].filter(k => /\.[a-z_]+\./.test(k)).slice(0, 40); out.prefsSample = JSON.stringify(pr.j).slice(0, 800);
out.at = new Date().toISOString();
return out;
