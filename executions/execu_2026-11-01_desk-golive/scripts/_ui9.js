// Wave 2 helpers (appended after prelude). Every created object is pushed to CREATED.
const T='e8e5e302-3873-4e32-b945-c9cd25c7659d', CM='0bbb599e-013b-4465-a41e-85a324a4e3ac', DQ='9a7e391c-be72-49e4-a1cf-763e5c88e23d', ME='7017d261-36ee-4e2f-9e60-2310ece52ef8';
const CREATED = [];
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : { kind: 'string', value: String(v) };
const body = vals => ({ data: Object.entries(vals).map(([f, v]) => ({ field: f, value: enc(v) })) });
const fl = r => { const o = { id: r.id }; for (const x of (r.data || [])) { const v = x.value || {}; o[x.field] = v.kind === 'array' ? (v.items || []).map(i => i.value) : v.value !== undefined ? v.value : (v.kind === 'null' ? null : v); } return o; };
const mkRec = async (mod, vals, tag) => { const r = await api('POST', `/modules/${mod}/records`, body(vals)); const id = r.j && r.j.data && (r.j.data.id || (r.j.data.record && r.j.data.record.id)); if (id) CREATED.push({ k: mod === T ? 'ticket' : mod === CM ? 'contact' : mod, id, tag }); return { s: r.s, id, e: r.j && r.j.error, raw: r.t.slice(0, 300) }; };
const getRec = async (mod, id) => { const r = await api('GET', `/modules/${mod}/records/${id}`); return { s: r.s, o: r.j && r.j.data ? fl(r.j.data) : null }; };
const patchRec = async (mod, id, vals) => api('PATCH', `/modules/${mod}/records/${id}`, body(vals));
const short = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message).slice(0, 160) : undefined });
const fin = extra => done({ R, CREATED, ...(extra || {}) });
const o = {}; const C2 = '60b25ebe-01d8-47df-91fc-6afb73a86912';
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const url = `/modules/${T}/records/new?clone_from=${C2}&layout=d1d2bc76-70d4-4dda-a33c-d6b684cd0099&clone_title_field=subject&clone_suffix=%20(Clone)&clone_skip=status%2Cresolution%2Cclosed_time%2Cticket_number`;
await page.goto(H + url, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/Subject/, 40); await sleep(3000);
// Status: find the field row labelled Status and open its control
const row = page.locator('label:has-text("Status")').first(); o.statusLabel = await row.count();
const ctl = page.locator('xpath=//*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//button | //*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//*[@role="combobox"]').first(); o.ctl = await ctl.count();
if (o.ctl) { await ctl.click().catch(() => {}); await sleep(1500); const opt = page.getByRole('option', { name: /^Open$/ }).first(); o.opt = await opt.count(); if (o.opt) await opt.click(); else { const any = page.locator('text=/^Open$/').last(); if (await any.count()) await any.click().catch(() => {}); } await sleep(1000); }
o.statusNow = await page.evaluate(() => { const l = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Status'); const box = l && l.closest('div') && l.closest('div').parentElement; return box ? box.innerText.replace(/\s+/g, ' ').slice(0, 80) : null; });
const save = page.locator('button', { hasText: /^Save$/ }).last(); await save.click().catch(e => o.saveErr = String(e.message).slice(0, 80));
let t = ''; for (let i = 0; i < 20; i++) { await sleep(1000); t = await txt(); if (!/Create Ticket/.test(t) || /Permission denied|created/i.test(t)) break; }
o.afterUrl = page.url().replace(H, ''); o.toast = (t.match(/(Permission denied\.?|Ticket created\.?|Record created\.?|could not be saved[^\n]{0,60}|This field is required)/gi) || []).slice(0, 4);
o.shotAfter = await shot('wave2/ui-clone-saved3');
const q = await api('GET', `/modules/${T}/records?limit=15&sort=-created_at`); o.clones = arr(q.j && q.j.data).map(r => fl(r)).filter(r => /\(Clone\)/.test(r.subject || '')).map(r => [r.id, r.subject, r.status, r.department, r.contact_id, r.priority]);
return done({ ...o, CREATED: o.clones.map(r => ({ k: 'ticket', id: r[0], tag: 'clone' })) });
