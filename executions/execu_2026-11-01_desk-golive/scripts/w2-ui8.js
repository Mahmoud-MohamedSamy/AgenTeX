const o = {}; const C2 = '36c92f6b-c2e2-41dd-b651-1f5da310355b';
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const url = `/modules/${T}/records/new?clone_from=${C2}&layout=d1d2bc76-70d4-4dda-a33c-d6b684cd0099&clone_title_field=subject&clone_suffix=%20(Clone)&clone_skip=status%2Cresolution%2Cclosed_time%2Cticket_number`;
await page.goto(H + url, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/Subject/, 40); await sleep(3000);
// Status: find the field row labelled Status and open its control
const row = page.locator('label:has-text("Status")').first(); o.statusLabel = await row.count();
const ctl = page.locator('xpath=//*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//button | //*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//*[@role="combobox"]').first(); o.ctl = await ctl.count();
if (o.ctl) { await ctl.click().catch(() => {}); await sleep(1500); const opt = page.getByRole('option', { name: /^Open$/ }).first(); o.opt = await opt.count(); if (o.opt) await opt.click(); else { const any = page.locator('text=/^Open$/').last(); if (await any.count()) await any.click().catch(() => {}); } await sleep(1000); }
o.statusNow = await page.evaluate(() => { const l = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Status'); const box = l && l.closest('div') && l.closest('div').parentElement; return box ? box.innerText.replace(/\s+/g, ' ').slice(0, 80) : null; });
const clr = page.locator('xpath=//*[normalize-space(text())="Ticket Owner"]/ancestor::*[self::div][2]//button[@aria-label]').first(); o.clr = await clr.count(); const al = o.clr ? await clr.getAttribute('aria-label') : null; o.clrLabel = al; if (o.clr) { await clr.click().catch(() => {}); await sleep(1000); }
const save = page.locator('button', { hasText: /^Save$/ }).last(); await save.click().catch(e => o.saveErr = String(e.message).slice(0, 80));
let t = ''; for (let i = 0; i < 20; i++) { await sleep(1000); t = await txt(); if (!/Create Ticket/.test(t) || /Permission denied|created/i.test(t)) break; }
o.afterUrl = page.url().replace(H, ''); o.toast = (t.match(/(Permission denied\.?|Ticket created\.?|Record created\.?|could not be saved[^\n]{0,60}|This field is required)/gi) || []).slice(0, 4);
o.shotAfter = await shot('wave2/ui-clone-saved2');
const q = await api('GET', `/modules/${T}/records?limit=15&sort=-created_at`); o.clones = arr(q.j && q.j.data).map(r => fl(r)).filter(r => /\(Clone\)/.test(r.subject || '')).map(r => [r.id, r.subject, r.status, r.department, r.contact_id, r.priority]);
return done({ ...o, CREATED: o.clones.map(r => ({ k: 'ticket', id: r[0], tag: 'clone' })) });
