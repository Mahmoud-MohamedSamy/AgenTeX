const mid = await modId(); const out = {};
const src = (await api('GET', '/web-forms/12df8c8a-ed79-490a-beec-0553eaf6ad42')).j.data; const def = JSON.parse(JSON.stringify(src.definition));
const fk = k => ({ key: k, placeholder: null, label: null, required: false, hidden: false, default_value: null, help: null });
def.fields = ['subject', 'contact.last_name', 'email', 'qa_lr_type', 'qa_lr_order'].map(fk); def.success_message = 'QA LR1112 thanks'; def.allowed_origins = ['https://staging-desk.taviportal.com'];
const c = await api('POST', '/web-forms', { kind: 'advanced_form', name: P + ' G14 form', department_id: '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', layout_id: I.layout, module_id: mid, definition: def });
out.create = SR(c).slice(0, 500); const d = c.j && c.j.data; if (d && d.id) { I.webform = d.id; SAVE(); LED('Desk web form ' + d.id); out.share = d.share_url || null; out.key = d.embed_key ? d.embed_key.length + ' chars' : null; out.enabled = d.is_enabled; fs.writeFileSync(RUN + '/out/webform.json', JSON.stringify({ share: d.share_url, key: d.embed_key })); }
return out;
