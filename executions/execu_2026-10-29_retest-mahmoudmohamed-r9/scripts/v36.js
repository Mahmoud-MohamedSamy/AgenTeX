// NDC-2634: QA portal on Leads; public link opened in a signed-out context, portal on and off.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LL = 'bf971461-2edc-45f2-b6e4-6e180aa64288'; const out = {};
const body = { name: 'QA RT r8 Portal', module_id: L, layout_id: LL, is_enabled: false, email_field_key: 'email', display_name_field_key: null, fields: [{ key: 'first_name', edit: false }, { key: 'phone', edit: true }],
  settings: { require_approval: false, language: 'en', temp_password_days: 7, idle_minutes: 30, captcha_on_login: false, branding: { logo_file_id: null, primary_color: '#2563eb', company_name: null, welcome_title: { en: null, ar: null }, welcome_text: { en: null, ar: null } }, access_condition: null, login_identifier: 'username', avatar_field_key: null, access_email: null, first_sign_in_update: null } };
const c = await api('POST', '/record-portals', body); const id = c.j?.data?.id, url = c.j?.data?.portal_url; out.create = c.s + ' ' + (id || c.t.slice(0, 300)); out.url = url; out.id = id; if (!id) return done(out);
const on = await api('PATCH', '/record-portals/' + id, { is_enabled: true, row_version: c.j.data.row_version }); out.on = on.s;
const ctx = await page.context().browser().newContext({ viewport: { width: 1400, height: 850 } }); const p2 = await ctx.newPage();
const r1 = await p2.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(e => null); await p2.waitForTimeout(8000); out.onStatus = r1 && r1.status(); out.onText = (await p2.innerText('body').catch(() => '')).split('\n').filter(Boolean).slice(0, 12); await p2.screenshot({ path: SHOT + '/v36-portal-on.png' });
const off = await api('PATCH', '/record-portals/' + id, { is_enabled: false, row_version: on.j?.data?.row_version }); out.off = off.s;
const r2 = await p2.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(e => null); await p2.waitForTimeout(8000); out.offStatus = r2 && r2.status(); out.offText = (await p2.innerText('body').catch(() => '')).split('\n').filter(Boolean).slice(0, 12); await p2.screenshot({ path: SHOT + '/v36-portal-off.png' });
await ctx.close(); return done(out);
