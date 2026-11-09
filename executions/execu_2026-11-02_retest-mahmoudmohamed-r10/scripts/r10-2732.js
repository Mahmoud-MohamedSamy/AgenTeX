// NDC-2732: enabled form "Potential Leads" (Anyware) → iframe page signed out → fields shown → submit one QA lead → lead exists.
const out = {}; const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-02_retest-mahmoudmohamed-r10/screenshots/raw/';
const fields = ['first_name', 'phone', 'email'].map(k => ({ key: k, placeholder: null, label: null, help: null }));
const def = { version: 2, language: 'en', success_message: 'Thank you. Your request has been submitted.', fields, attachments: { enabled: false, screenshot_enabled: false }, captcha_enabled: false, launcher: null, allowed_origins: [],
  style: { font_family: 'system', font_size: 13, font_color: '#1F2937', background_color: '#FFFFFF', label_alignment: 'top', width_px: 600, submit_label: null, reset_label: null, show_form_name: false },
  redirect_url: null, owner: { mode: 'user', user_id: T.OWNER, assignment_rule_id: null, notify_owner: false, notify_email: false, notify_user_ids: [] }, share_link_enabled: true, capture: null, duplicates: null, live_chat: false };
const fc = await api('o', 'POST', '/web-forms', { kind: 'advanced_form', name: 'QA RT r10 2732 form', department_id: null, layout_id: T.LEADS_STD, module_id: T.LEADS, definition: def, app_key: 'crm' });
const f = fc.j?.data; out.form = fc.s + ' ' + (f?.id || fc.t.slice(0, 300)); if (!f?.id) return out; ledger(`web form ${f.id} "QA RT r10 2732 form"`);
out.enabled = f.is_enabled ?? f.enabled ?? f.status;
const url = `${H}/embed/feedback/index.html?key=${f.embed_key}&mode=frame`;
const b = ctx.o.c.browser(); const c = await b.newContext({ viewport: { width: 900, height: 900 } }); const p = await c.newPage();
const sess = []; p.on('response', r => { if (/web-forms\/public/.test(r.url())) sess.push(r.request().method() + ' ' + r.status() + ' ' + r.url().replace(/^.*public\/[^/]+/, '')); });
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(12000);
await p.screenshot({ path: RAW + '2732-1-iframe-signed-out.png' });
out.text = (await p.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
out.inputs = await p.locator('input:visible, textarea:visible').evaluateAll(a => a.map(x => (x.name || x.id || x.placeholder || x.type)));
const N = 'QA RT r10 2732 iframe ' + String(Date.now()).slice(-5);
const ins = p.locator('input:visible'); const n = await ins.count();
for (let i = 0; i < n; i++) { const el = ins.nth(i); const meta = (await el.evaluate(x => (x.name + ' ' + x.id + ' ' + x.placeholder + ' ' + x.type + ' ' + (x.labels?.[0]?.innerText || '')).toLowerCase())); if (/hidden|checkbox|file/.test(meta)) continue;
  if (/mail/.test(meta)) await el.fill('qa.r10.2732@example.com'); else if (/phone|mobile|tel/.test(meta)) await el.fill('01002732' + String(Date.now()).slice(-3)); else if (/name/.test(meta)) await el.fill(N); }
await p.waitForTimeout(5000); // elapsed time guard
await p.screenshot({ path: RAW + '2732-2-filled.png' });
await p.getByRole('button', { name: /submit|send/i }).first().click().catch(e => out.submitErr = String(e).slice(0, 100));
await p.waitForTimeout(8000); await p.screenshot({ path: RAW + '2732-3-submitted.png' });
out.after = (await p.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); out.calls = sess; await c.close();
for (let i = 0; i < 8 && !out.lead; i++) { for (let pg = 1; pg <= 2; pg++) { const h = arr((await api('o', 'GET', `/modules/${T.LEADS}/records?page=${pg}`)).j?.data).find(x => JSON.stringify(x.data).includes(N)); if (h) { out.lead = h.id; ledger(`lead ${h.id} "${N}" (web form iframe)`); } } if (!out.lead) await sleep(4000); }
return out;
