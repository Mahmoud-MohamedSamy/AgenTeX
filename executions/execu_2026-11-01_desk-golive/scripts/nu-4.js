// Owner UI pass 4: create via screen with template (W2-11, W2-13), keyboard focus (W2-79), Arabic/RTL (W2-78), attachments (W2-48/49)
const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const main = async () => (await page.$eval('main', m => m.innerText).catch(() => '')).replace(/\s+/g, ' ');
const raw = t => (t.match(/\b[a-z]+[A-Za-z]*(\.[a-zA-Z_]+){2,}\b/g) || []).filter(x => !/\.(com|software|png|json|js)$/.test(x)).slice(0, 8);
// --- create via screen
await page.goto(H + `/modules/${T}/records/new?layout=1b55c25d-eb27-4046-afd1-b292398b435b`, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/Create Ticket/, 90); await sleep(3000);
const ut = page.locator('button, [role=combobox]', { hasText: /Use template/ }).first(); o.useTpl = await ut.count();
if (o.useTpl) { await ut.click().catch(() => {}); await sleep(1500); const op = page.locator('[role=option], [role=menuitem], button', { hasText: /QA GL W2 template/ }).first(); o.tplOption = await op.count(); if (o.tplOption) { await op.click().catch(() => {}); await sleep(3000); } }
o.subjectAfterTpl = await page.$$eval('input', is => is.filter(i => i.offsetParent !== null).map(i => i.value).filter(v => /QA GL W2/.test(v)));
// make subject unique
const subj = page.locator('xpath=//*[normalize-space(text())="Subject"]/ancestor::*[self::div][2]//input').first(); o.subjInput = await subj.count();
if (o.subjInput) { await subj.fill('QA GL W2 screen create'); }
const ctl = page.locator('xpath=//*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//button | //*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//*[@role="combobox"]').first(); if (await ctl.count()) { await ctl.click().catch(() => {}); await sleep(1200); const opt = page.getByRole('option', { name: /^Open$/ }).first(); if (await opt.count()) await opt.click().catch(() => {}); await sleep(800); }
o.formTop = (await main()).slice(0, 700); o.shotCreateForm = await shot('../wave2n/ui-create-form');
const save = page.locator('button', { hasText: /^Save$/ }).last(); await save.click().catch(e => o.saveErr = String(e.message).slice(0, 80));
let t = ''; for (let i = 0; i < 25; i++) { await sleep(1000); t = await txt(); if (/\/records\/[0-9a-f-]{36}/.test(page.url()) || /Permission denied|required|could not/i.test(t)) break; }
o.afterUrl = page.url().replace(H, '').slice(0, 160); o.toast = (t.match(/(Permission denied\.?|Ticket created\.?|Record created\.?|could not be saved[^\n]{0,60}|[A-Za-z ]+ is required\.?)/gi) || []).slice(0, 5); o.shotCreateAfter = await shot('../wave2n/ui-create-after');
const q = await api('GET', `/modules/${T}/records?limit=10&sort=-created_at`); o.created = arr(q.j && q.j.data).map(r => fl(r)).filter(r => /QA GL W2 (screen create|from template)/.test(r.subject || '')).map(r => [r.id, r.subject, r.status, r.department === DQ ? 'Marketing' : r.department, r.priority, r.channel, r.ticket_number]);
for (const c of o.created) CREATED.push({ k: 'ticket', id: c[0], tag: 'screen' });
if (o.created[0]) { await sleep(3000); o.wfScreen = await wfx(o.created[0][0]); }
// --- keyboard focus on ticket page
await page.goto(H + '/views/all/tickets/' + IDS.base, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base ticket edited/, 90); await sleep(2000);
await page.locator('h1, h2').filter({ hasText: /QA GL W2 base ticket edited/ }).first().click({ trial: true }).catch(() => {});
await page.evaluate(() => { const h = [...document.querySelectorAll('h1,h2')].find(x => /QA GL W2 base ticket edited/.test(x.textContent)); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); } });
const seq = []; for (let i = 0; i < 14; i++) { await page.keyboard.press('Tab'); await sleep(150); seq.push(await page.evaluate(() => { const a = document.activeElement; if (!a) return '-'; const cs = getComputedStyle(a); return (a.getAttribute('aria-label') || a.innerText || a.tagName).trim().replace(/\s+/g, ' ').slice(0, 28) + (cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px' || /ring/.test(a.className) || cs.boxShadow !== 'none' ? ' [ring]' : ' [no ring]'); })); }
o.tabOrder = seq; o.shotFocus = await shot('../wave2n/ui-focus');
// --- Arabic
const lang = page.locator('button', { hasText: /^EN$/ }).first(); o.langBtn = await lang.count();
if (o.langBtn) { await lang.click().catch(() => {}); await sleep(1200); const ar = page.locator('[role=menuitem], [role=option], button', { hasText: /العربية|Arabic/ }).first(); o.arOpt = await ar.count(); if (o.arOpt) { await ar.click().catch(() => {}); await sleep(8000); const ta = await txt(); o.dir = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction); o.arText = ta.replace(/\s+/g, ' ').slice(0, 700); o.arRaw = raw(ta); o.latinLabels = (ta.match(/\b(CONVERSATION|RESOLUTION|HISTORY|Reply All|Pick up|Ticket Properties|Status|Priority|Channel)\b/g) || []).slice(0, 10); o.shotAr = await shot('../wave2n/ui-arabic');
  await page.mouse.wheel(0, 900); await sleep(1500); o.shotAr2 = await shot('../wave2n/ui-arabic-2');
  const back = page.locator('button', { hasText: /^AR$|^ع$|العربية/ }).first(); if (await back.count()) { await back.click().catch(() => {}); await sleep(1200); const en = page.locator('[role=menuitem], [role=option], button', { hasText: /^English$|^EN$/ }).first(); if (await en.count()) { await en.click().catch(() => {}); await sleep(5000); } } o.langAfter = await page.evaluate(() => document.documentElement.lang + '/' + (document.documentElement.dir || '')); } }
// --- attachment via presigned flow + limits
const P = `/desk/tickets/${IDS.base}`; const txtBody = 'QA GL W2 attachment ' + new Date().toISOString();
const up = await api('POST', '/files', { app_key: 'desk', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: 'qa-gl-w2.txt', declared_content_type: 'text/plain', size_bytes: txtBody.length, owner_user_id: ME }); o.fileCreate = sh(up);
const fd = up.j && up.j.data; const fid = fd && (fd.file_id || fd.id); const url = fd && (fd.upload_url || fd.presigned_url);
if (fid && url) { const put = await page.context().request.fetch(url, { method: fd.upload_method || 'PUT', headers: { 'content-type': 'text/plain', ...(fd.upload_headers || {}) }, data: txtBody, failOnStatusCode: false }); o.filePut = put.status();
  o.fileConfirm = sh(await api('POST', `/files/${fid}/confirm`, { file_id: fid, size_bytes: txtBody.length }));
  o.attach = sh(await api('POST', `${P}/attachments`, { file_id: fid })); const al = await api('GET', `${P}/attachments`); const atts = arr(al.j && al.j.data); o.attList = atts.map(a => [a.id, a.file_name || a.name || a.original_filename, a.size_bytes || a.size]);
  if (atts[0]) o.attDelete = sh(await api('DELETE', `${P}/attachments/${atts[0].id}`)); }
o.fileHuge = sh(await api('POST', '/files', { app_key: 'desk', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: 'qa-gl-w2-big.zip', declared_content_type: 'application/zip', size_bytes: 200 * 1024 * 1024, owner_user_id: ME }));
o.fileExe = sh(await api('POST', '/files', { app_key: 'desk', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: 'qa-gl-w2.exe', declared_content_type: 'application/x-msdownload', size_bytes: 1000, owner_user_id: ME }));
const fh = o.fileHuge.d && JSON.parse(o.fileHuge.d.endsWith('}') ? o.fileHuge.d : '{}'); const fe = o.fileExe.d && JSON.parse(o.fileExe.d.endsWith('}') ? o.fileExe.d : '{}');
return fin(o);
