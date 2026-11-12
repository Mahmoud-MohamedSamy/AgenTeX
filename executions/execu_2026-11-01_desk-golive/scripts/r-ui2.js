// 12 Nov resume, owner screen checks round 2
const o = {}; const EMAIL = '9804a4f1-b4d3-4b76-8638-3837001ceedc';
const flat = async () => (await txt()).replace(/\s+/g, ' ');
const clickText = async (re, sel) => { const l = page.locator(sel || 'a, button, [role=link], [role=menuitem], span', { hasText: re }).first(); const n = await l.count(); if (n) await l.click().catch(() => {}); return n; };
// W2-13: department Marketing, then Use template
await go(`/modules/${T}/records/new`, 9000);
const dep = page.locator('text=Department').locator('xpath=following::*[@role="combobox" or self::button or self::input][1]').first();
await dep.click().catch(() => {}); await sleep(1500); await page.keyboard.type('Marketing', { delay: 40 }); await sleep(1500);
const mo = page.locator('[role=option]', { hasText: /^Marketing$/ }).first(); o.mktOpt = await mo.count(); if (o.mktOpt) await mo.click().catch(() => {}); else await page.keyboard.press('Enter');
await sleep(3000); o.useTplAfter = await page.locator('button, [role=combobox]', { hasText: /Use template/i }).count();
if (o.useTplAfter) { await page.locator('button, [role=combobox]', { hasText: /Use template/i }).first().click().catch(() => {}); await sleep(2000);
  const opt = page.locator('[role=option], [role=menuitem], li, button', { hasText: /QA GL W2 template/ }).first(); o.tplOpt = await opt.count(); if (o.tplOpt) { await opt.click().catch(() => {}); await sleep(3500); } }
o.filled = await page.$$eval('input, textarea', is => is.filter(i => i.offsetParent !== null && i.value).map(i => [i.name || i.getAttribute('aria-label') || i.placeholder, i.value.slice(0, 60)]).slice(0, 15));
o.formText = ((await flat()).match(/Create Ticket.{0,700}/) || [''])[0];
o.shotTpl = await shot('../wave2n/r-template-prefill2');
await clickText(/^Cancel$/, 'button'); await sleep(1500); await clickText(/Discard|Leave|Yes/i, '[role=dialog] button');
// W2-30 signature: save, reply, check, clear
await go('/settings/personal/signatures', 10000);
const ed = page.locator('[contenteditable=true]').first(); o.sigEditor = await ed.count();
if (o.sigEditor) { await ed.click(); await page.keyboard.type('QA GL W2 signature line', { delay: 25 }); await clickText(/^Save signature$/, 'button'); await sleep(4000); o.sigSaved = ((await flat()).match(/[^.]{0,60}(saved|Signature)[^.]{0,60}/i) || [''])[0]; }
o.sigApi = (await api('GET', '/mail/signatures/me')).t.slice(0, 300);
const rp = await api('POST', `/desk/tickets/${EMAIL}/replies`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 r email signature', body_html: '<p>QA GL W2 reply to check the signature, please ignore.</p>' });
o.sigReply = rp.s; await sleep(3000);
const rl = await api('GET', `/desk/tickets/${EMAIL}/replies`); const last = arr(rl.j && rl.j.data).find(r => /signature/.test(r.subject || '')); o.sigInReply = last ? /QA GL W2 signature line/.test(JSON.stringify(last)) : 'reply not found'; o.sigReplyBody = last ? (last.body_html || '').slice(0, 300) : '';
await go('/settings/personal/signatures', 10000); const ed2 = page.locator('[contenteditable=true]').first(); if (await ed2.count()) { await ed2.click(); await page.keyboard.press('Control+A'); await page.keyboard.press('Delete'); await clickText(/^Save signature$/, 'button'); await sleep(3000); }
const del = page.locator('button', { hasText: /Delete|Remove/ }).first(); if (await del.count()) { await del.click().catch(() => {}); await sleep(1500); await clickText(/Delete|Remove|Yes/i, '[role=dialog] button'); await sleep(2000); }
o.sigAfter = (await api('GET', '/mail/signatures/me')).t.slice(0, 200);
// W2-64 ticket number page
await go('/setup', 9000); o.tn = await clickText(/^Ticket Number$/); await sleep(12000); o.tnUrl = page.url(); o.tnPage = ((await flat()).match(/Ticket Number.{0,600}/g) || []).pop(); o.shotTn = await shot('../wave2n/r-ticket-number');
// Data Sharing + Roles (for the C visibility candidate)
await go('/setup', 9000); o.ds = await clickText(/^Data Sharing$/); await sleep(12000); o.dsUrl = page.url(); o.dsPage = ((await flat()).match(/Data Sharing.{0,700}/g) || []).pop(); o.shotDs = await shot('../wave2n/r-data-sharing');
await go('/setup', 9000); o.rl = await clickText(/^Roles$/); await sleep(12000); o.rlUrl = page.url(); o.rlPage = ((await flat()).match(/Roles.{0,900}/g) || []).pop(); o.shotRoles = await shot('../wave2n/r-roles');
return done(o);
