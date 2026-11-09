const o = {}; const C2 = '36c92f6b-c2e2-41dd-b651-1f5da310355b';
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const url = `/modules/${T}/records/new?clone_from=${C2}&layout=d1d2bc76-70d4-4dda-a33c-d6b684cd0099&clone_title_field=subject&clone_suffix=%20(Clone)&clone_skip=status%2Cresolution%2Cclosed_time%2Cticket_number`;
await page.goto(H + url, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); let t = await waitText(/Subject/, 40); await sleep(3000);
o.subjectVal = await page.$$eval('input', is => is.filter(i => i.offsetParent !== null).map(i => i.value).filter(v => /QA GL W2/.test(v)));
o.buttons = await page.$$eval('button', bs => bs.filter(b => b.offsetParent !== null).map(b => b.innerText.trim()).filter(Boolean).slice(-12));
o.shotForm = await shot('wave2/ui-clone-form');
const save = page.locator('button', { hasText: /^(Save|Create|Save Ticket)$/ }).last(); o.saveCount = await save.count();
if (o.saveCount) { await save.click().catch(e => o.saveErr = String(e.message).slice(0, 80)); await sleep(9000); t = await txt(); o.afterUrl = page.url().replace(H, ''); o.toast = (t.match(/(Permission denied\.?|Ticket created|created|could not|required)[^\n]{0,80}/gi) || []).slice(0, 4); o.shotAfter = await shot('wave2/ui-clone-after'); }
const q = await api('GET', `/modules/${T}/records?limit=10&sort=-created_at`); o.recent = arr(q.j && q.j.data).map(r => fl(r)).filter(r => /QA GL W2/.test(r.subject || '')).map(r => [r.id, r.subject, r.status, r.department === DQ]);
return done({ ...o, CREATED: o.recent.filter(r => /\(Clone\)/.test(r[1])).map(r => ({ k: 'ticket', id: r[0], tag: 'clone' })) });
