// Owner UI pass 3: queues/tags (W2-06..08), custom view open (W2-02), clone (W2-41)
const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const main = async () => (await page.$eval('main', m => m.innerText).catch(() => '')).replace(/\s+/g, ' ');
const waitMain = async (min, n) => { let m = ''; for (let i = 0; i < (n || 45); i++) { await sleep(1000); m = await main(); if (m.length > min) break; } return m; };
const raw = t => (t.match(/\b[a-z]+[A-Za-z]*(\.[a-zA-Z_]+){2,}\b/g) || []).filter(x => !/\.(com|software|png|json|js)$/.test(x)).slice(0, 6);
await page.goto(H + '/views/all/tickets', { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/All Tickets \(\d/, 90);
for (const [k, name] of [['agentQ', 'Agent Queue'], ['teamQ', 'Team Queue'], ['tags', 'Tags']]) { const l = page.locator('nav a, aside a, a', { hasText: new RegExp('^' + name + '$') }).first(); if (await l.count()) { const ts = Date.now(); await l.click().catch(() => {}); const m = await waitMain(80, 60); await sleep(3000); const m2 = await main(); o[k] = { ms: Date.now() - ts, url: page.url().replace(H, ''), text: m2.slice(0, 500), raw: raw(m2) }; o['shot_' + k] = await shot('../wave2n/ui-' + k); } else o[k] = 'link not found'; }
// Tags page for Marketing
await page.goto(H + '/views/tags?department=' + DQ, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); const tm = await waitMain(80, 60); o.tagsMarketing = tm.slice(0, 400);
// custom view from the view switcher
await page.goto(H + '/views/all/tickets', { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/All Tickets \(\d/, 90); await sleep(1500);
const sw = page.locator('button', { hasText: /^All Tickets \(\d+\)/ }).first(); if (await sw.count()) { await sw.click().catch(() => {}); await sleep(2000); const it = page.locator('[role=menuitem], [role=option], a, button', { hasText: /^QA GL W2 view/ }).first(); o.viewInSwitcher = await it.count(); if (o.viewInSwitcher) { await it.click().catch(() => {}); await sleep(6000); o.customUrl = page.url().replace(H, ''); o.customView = (await main()).slice(0, 500); o.shotCustom = await shot('../wave2n/ui-custom-view2'); } else { o.switcher = (await txt()).replace(/\s+/g, ' ').slice(0, 300); await page.keyboard.press('Escape'); } }
// clone child 2 through More > Clone
await page.goto(H + '/views/all/tickets/' + IDS.child_2, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 child 2/, 90); await sleep(2000);
const more = page.locator('button[aria-label="More ticket actions"]').first(); if (await more.count()) { await more.click().catch(() => {}); await sleep(1200); const cl = page.getByRole('menuitem', { name: 'Clone' }).first(); if (await cl.count()) { await cl.click().catch(() => {}); await waitText(/Subject/, 40); await sleep(3000);
  o.cloneUrl = page.url().replace(H, '').slice(0, 260); o.cloneSubject = await page.$$eval('input', is => is.filter(i => i.offsetParent !== null).map(i => i.value).filter(v => /QA GL W2/.test(v)));
  o.cloneForm = (await main()).slice(0, 500); o.shotCloneForm = await shot('../wave2n/ui-clone-form');
  const ctl = page.locator('xpath=//*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//button | //*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//*[@role="combobox"]').first(); o.statusCtl = await ctl.count();
  if (o.statusCtl) { await ctl.click().catch(() => {}); await sleep(1500); const opt = page.getByRole('option', { name: /^Open$/ }).first(); if (await opt.count()) await opt.click().catch(() => {}); else { const any = page.locator('text=/^Open$/').last(); if (await any.count()) await any.click().catch(() => {}); } await sleep(1000); }
  const save = page.locator('button', { hasText: /^Save$/ }).last(); await save.click().catch(e => o.saveErr = String(e.message).slice(0, 80));
  let t = ''; for (let i = 0; i < 25; i++) { await sleep(1000); t = await txt(); if (/\/records\/[0-9a-f-]{36}/.test(page.url()) || /Permission denied|required/i.test(t)) break; }
  o.afterUrl = page.url().replace(H, '').slice(0, 200); o.toast = (t.match(/(Permission denied\.?|Ticket created\.?|Record created\.?|could not be saved[^\n]{0,60}|This field is required|is required)/gi) || []).slice(0, 4); o.shotCloneAfter = await shot('../wave2n/ui-clone-after'); } }
const q = await api('GET', `/modules/${T}/records?limit=15&sort=-created_at`); o.clones = arr(q.j && q.j.data).map(r => fl(r)).filter(r => /\(Clone\)/.test(r.subject || '')).map(r => [r.id, r.subject, r.status, r.department === DQ, r.contact_id === CON, r.channel, r.priority, r.ticket_number]);
for (const c of o.clones) CREATED.push({ k: 'ticket', id: c[0], tag: 'clone' });
if (o.clones[0]) o.wfClone = await wfx(o.clones[0][0]);
return fin(o);
