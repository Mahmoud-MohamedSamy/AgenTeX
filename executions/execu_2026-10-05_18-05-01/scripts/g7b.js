// Group 7 follow-ups: L6 audit log, L7 Arabic switch, L9 unnamed buttons, E2E-1 related list registration (read-only except language, which is switched back).
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets'); const MID = QA.id;
const DEF = arr((await api('GET', `/modules/${MID}/layouts`)).j.data).find(x => x.isDefault);
await step('L6', async () => {
  const calls = []; const onR = async r => { if (r.url().includes('/api/v1/') && /audit/.test(r.url()) && r.request().method() === 'GET') { try { calls.push(r.url().replace(API, '') + ' ' + r.status() + ' ' + (await r.text()).slice(0, 200)); } catch (e) { } } };
  page.on('response', onR); await go('/settings/audit-log', 10000); page.off('response', onR);
  const t = await txt(); const s = await shot('L6-audit-log');
  const any = /QA MF|qa_mf|module|field|layout/i.test(t.split('Audit Log').slice(-1)[0] || '');
  rec('L6', /QA MF|qa_mf/.test(t) ? 'PASS' : 'FAIL', `Audit Log page text mentions QA MF changes: ${/QA MF|qa_mf/.test(t)}; page shows module/field/layout entities at all: ${any}; API calls: ${calls.slice(0, 3).join(' || ')}`, { shot: s });
});
await step('L7', async () => {
  await go(`/settings/modules-and-fields/${MID}`, 6000);
  const lang = page.locator('button[aria-label="Switch language"], button:has-text("EN")').first(); await lang.click(); await sleep(800);
  const opts = (await txt()).match(/العربية|Arabic/g) || [];
  await page.locator('[role=menuitem], [role=option], button, li').filter({ hasText: /العربية|Arabic/ }).first().click(); await sleep(4000);
  const dir = await page.evaluate(() => document.documentElement.dir || document.body.dir || getComputedStyle(document.body).direction); const t = await txt();
  const en = ['Layouts', 'Fields', 'Workflow Rules', 'Summary', 'Create New Layout', 'Design your own layouts'].filter(w => t.includes(w));
  const s = await shot('L7-arabic-module-page');
  await page.locator('button[aria-label], button').filter({ hasText: /AR|ع/ }).first().click().catch(() => { }); await sleep(700);
  await page.locator('[role=menuitem], [role=option], button, li').filter({ hasText: /^English$/ }).first().click().catch(() => { }); await sleep(3000);
  const back = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction);
  rec('L7', dir === 'rtl' && en.length === 0 ? 'PASS' : 'FAIL', `Arabic UI on Setup → Modules and Fields → QA module: dir=${dir}; English strings still shown: [${en.join(', ')}]; back to English: dir=${back}`, { shot: s });
});
await step('L9', async () => {
  await go(`/settings/modules-and-fields/${MID}/layouts/${DEF.id}`, 10000);
  const un = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.getClientRects().length && !(b.innerText.trim() || b.getAttribute('aria-label') || b.title)).map(b => b.outerHTML.slice(0, 160)));
  rec('L9', un.length === 0 ? 'PASS' : 'FAIL', `buttons without an accessible name: ${un.length} — ${un.join(' | ')}`, { severity: 'Low' });
});
await step('E2E-1', async () => {
  const rel = await api('GET', `/modules/${M.contacts}/related-modules`); const has = (rel.t || '').includes(MID) || /qa_lk|QA MF/.test(rel.t || '');
  const lst = await api('GET', `/modules/${M.contacts}/records?page_size=5`); const lst2 = await api('GET', `/modules/${M.contacts}/records`);
  rec('E2E-1', has ? 'PASS' : 'FAIL', `Contacts related-modules lists the QA lookup (qa_lk, title "QA MF Devices"): ${has} (${rel.s}: ${rel.t.slice(0, 200)}); contact records available: ${arr(lst.j && lst.j.data).length || arr(lst2.j && lst2.j.data).length} (${lst.s}/${lst2.s}) — linking a real contact not done (Contacts sync with CRM)`, { severity: 'Medium' });
});
return done();
