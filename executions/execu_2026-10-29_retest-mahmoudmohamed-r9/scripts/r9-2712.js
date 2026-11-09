// NDC-2712: QA web form on Leads; public submissions (no sign-in) as the embedded form sends them.
// control (trap empty) → lead; trap filled with page_origin null (the real embed) → no lead; trap filled with page_origin set → no lead.
const out = {}; const t = String(Date.now()).slice(-5);
const fields = ['first_name', 'phone', 'email'].map(k => ({ key: k, placeholder: null, label: null, help: null }));
const def = { version: 2, language: 'en', success_message: 'Thank you. Your request has been submitted.', fields, attachments: { enabled: false, screenshot_enabled: false }, captcha_enabled: false, launcher: null, allowed_origins: [],
  style: { font_family: 'system', font_size: 13, font_color: '#1F2937', background_color: '#FFFFFF', label_alignment: 'top', width_px: 600, submit_label: null, reset_label: null, show_form_name: false },
  redirect_url: null, owner: { mode: 'user', user_id: T.OWNER, assignment_rule_id: null, notify_owner: false, notify_email: false, notify_user_ids: [] }, share_link_enabled: true, capture: null, duplicates: null, live_chat: false };
const f = await api('o', 'POST', '/web-forms', { kind: 'advanced_form', name: 'QA RT 2712 form ' + t, department_id: null, layout_id: T.LEADS_STD, module_id: T.LEADS, definition: def, app_key: 'crm' });
out.form = f.s + ' ' + (f.j?.data?.id || f.t.slice(0, 300)); const fid = f.j?.data?.id, key = f.j?.data?.embed_key; if (!fid) return out;
ledger(`web form ${fid} "QA RT 2712 form ${t}"`);
const R = ctx.o.c.request; const HD = { Origin: H, Referer: H + '/embed/feedback/index.html' };
const submit = async (name, phone, honeypot, origin) => {
  const s = await R.post(`${H}/api/v1/web-forms/public/${key}/session`, { headers: HD, failOnStatusCode: false }); const tok = (await s.json().catch(() => ({})))?.data?.session_token; if (!tok) return 'no session ' + s.status();
  const r = await R.post(`${H}/api/v1/web-forms/public/${key}/submissions`, { headers: { ...HD, 'content-type': 'application/json', 'X-Web-Form-Session': tok }, failOnStatusCode: false,
    data: JSON.stringify({ submission_id: crypto.randomUUID(), values: { first_name: name, phone, email: `qa.rt.2712.${t}@example.com` }, file_ids: [], captcha_token: null, page_origin: origin, elapsed_ms: 4500, visitor_id: crypto.randomUUID(), honeypot }) });
  return r.status() + ' ' + (await r.text()).slice(0, 200);
};
const find = async name => { for (let i = 0; i < 8; i++) { for (let p = 1; p <= 2; p++) { const h = arr((await api('o', 'GET', `/modules/${T.LEADS}/records?page=${p}`)).j?.data).find(x => JSON.stringify(x.data).includes(name)); if (h) return h.id; } await sleep(4000); } return null; };
try {
  const N = { ok: `QA RT 2712 ok ${t}`, spamNull: `QA RT 2712 spam null ${t}`, spamOrigin: `QA RT 2712 spam origin ${t}` };
  out.control = await submit(N.ok, '01012' + t, '', null);
  out.trapNull = await submit(N.spamNull, '01013' + t, 'http://spam.example', null);
  out.trapOrigin = await submit(N.spamOrigin, '01014' + t, 'http://spam.example', H + '/qa-rt-2712');
  for (const [k, n] of Object.entries(N)) { const id = await find(n); out['lead ' + k] = id || 'none'; if (id) ledger(`lead ${id} "${n}" (web form)`); }
} finally { out.formDeleted = (await api('o', 'DELETE', '/web-forms/' + fid)).s; }
return out;
