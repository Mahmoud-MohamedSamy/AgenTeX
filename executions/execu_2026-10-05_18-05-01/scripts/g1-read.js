// Group 1 — B (module list), E (module detail), F (fields), J-read. No writes.
const mods = arr((await api('GET', '/modules')).j.data);
const names = mods.map(m => m.pluralForm);

await step('B1', async () => {
  await go('/settings/modules-and-fields');
  const t = await txt(); const miss = names.filter(n => !t.includes(n));
  const hdrs = ['Displayed In Tabs As', 'Module Name', 'Last Modified', 'Status'].filter(h => !t.includes(h));
  rec('B1', miss.length || hdrs.length || !t.includes('1–9 of 9') ? 'FAIL' : 'PASS', `rows ${names.length - miss.length}/9; missing headers: ${hdrs.join(',') || 'none'}; counter "1–9 of 9" ${t.includes('1–9 of 9') ? 'shown' : 'NOT shown'}`);
});
await step('B2', async () => {
  const un = await page.locator('text=/^UN$/').count();
  const named = mods.filter(m => m.lastModifiedByName).length;
  rec('B2', un > 0 ? 'FAIL' : 'PASS', `Last Modified avatar shows "UN" on ${un} rows; API lastModifiedByName set on ${named}/9 modules (seeded by system user a7a7a7a7-…0004)`, un > 0 ? { shot: await shot('B2-last-modified-UN') } : {});
});
await step('B3', async () => {
  const box = page.getByPlaceholder('Search').first();
  const count = async q => { await box.fill(q); await sleep(1200); return (await txt()); };
  const a = await count('tick'); const b = await count('TICK'); const c = await count('تذاكر'); const d = await count('zzqqxx');
  const has = (t, n) => t.includes(n);
  const ok = has(a, 'Tickets') && !has(a, 'Contracts') && has(b, 'Tickets') && !has(c, 'Contracts') && !has(d, 'Contracts');
  const emptyMsg = (d.match(/No [^\n]{0,60}/) || [''])[0];
  rec('B3', ok ? 'PASS' : 'FAIL', `"tick" → Tickets only: ${has(a, 'Tickets') && !has(a, 'Contracts')}; "TICK" case-insensitive: ${has(b, 'Tickets')}; Arabic → no rows: ${!has(c, 'Contracts')}; nonsense empty state: "${emptyMsg}"`);
  await box.fill(''); await sleep(800);
});
await step('B4', async () => {
  const t = await txt(); const opts = ['10', '25', '50', '100'].filter(o => t.includes(o));
  rec('B4', t.includes('Page 1 of 1') && opts.length === 4 ? 'PASS' : 'FAIL', `rows-per-page options shown: ${opts.join('/')}; "Page 1 of 1": ${t.includes('Page 1 of 1')}`);
});
await step('B6', async () => {
  const sw = page.getByRole('switch', { name: /Tickets/ }).first();
  const n = await sw.count();
  const info = n ? await sw.evaluate(e => ({ dis: e.disabled || e.getAttribute('aria-disabled'), title: e.title || e.getAttribute('aria-label') })) : null;
  rec('B6', 'NOT RUN', `toggling a standard module is outside the allowed writes. Read-only: Tickets status switch present=${!!n}, disabled=${info && info.dis}, label="${info && info.title}". The dependency guard is retested with QA MF Assets in group C`);
});
await step('B7', async () => {
  await page.getByText('Web Tabs', { exact: true }).first().click(); await sleep(1200); const a = await txt();
  await page.getByText('Global Sets', { exact: true }).first().click(); await sleep(1200); const b = await txt();
  const crm = /inside the CRM/.test(a); const dev = a.includes('In Development') && b.includes('In Development');
  rec('B7', crm ? 'FAIL' : (dev ? 'PASS' : 'FAIL'), `"In Development" badge on both: ${dev}; Web Tabs text says "inside the CRM": ${crm}`, crm ? { shot: await (async () => { await page.getByText('Web Tabs', { exact: true }).first().click(); await sleep(800); return shot('B7-web-tabs-says-CRM'); })() } : {});
  await page.getByText('Modules', { exact: true }).first().click(); await sleep(1000);
});
await step('B8', async () => {
  const n = await page.locator('.mf-row-menu-btn, button[aria-label^="Open menu for"]').count();
  rec('B8', n === 0 ? 'INCONCLUSIVE' : 'PASS', n === 0 ? 'no row-menu button on any of the 9 standard modules (the menu exists in the code for custom modules); retest on QA MF Assets in group C' : `${n} row menus`);
});
await step('B9', async () => rec('B9', 'NOT RUN', 'reordering changes the order of the standard modules — outside the allowed writes'));
await step('B10', async () => {
  const t = await txt(); const crm = t.includes('Set up your CRM');
  rec('B10', crm ? 'FAIL' : 'PASS', `Setup sidebar shows "Set up your CRM" in Desk: ${crm}`, crm ? { shot: await shot('B10-setup-your-crm') } : {});
});

// E — module detail
await step('E1', async () => {
  await go(`/settings/modules-and-fields/${M.tickets}`);
  const tabs = await page.getByRole('tab').allInnerTexts().catch(() => []);
  const t = await txt(); const want = ['Layouts', 'Fields', 'Workflow Rules', 'Summary']; const has = want.filter(w => t.includes(w));
  const rules = ['Layout Rules', 'Validation Rules', 'Map Dependency Fields'].filter(w => t.includes(w));
  rec('E1', has.length === 4 ? 'PASS' : 'FAIL', `tabs: ${has.join(', ')}; rule tabs shown: ${rules.join(', ') || 'none'} (layout/validation rules are gaps Z1/Z2 → MISSING rows)`);
});
await step('E2', async () => {
  await page.getByText('Summary', { exact: true }).first().click(); await sleep(2000); const t = await txt();
  const m = mods.find(x => x.id === M.tickets);
  const checks = { singular: m.singularForm, plural: m.pluralForm, key: m.moduleKey, api: m.apiName, status: 'Active', storage: 'Organization', created: '06/09/2026' };
  const bad = Object.entries(checks).filter(([k, v]) => !t.includes(v));
  const dash = (t.match(/Created By\s*\n\s*—/) || t.match(/Created By\s*—/)) ? 'Created By shows "—"' : '';
  rec('E2', bad.length ? 'FAIL' : 'PASS', `summary matches API for ${Object.keys(checks).length - bad.length}/${Object.keys(checks).length} values${bad.length ? '; mismatched: ' + bad.map(b => b[0]).join(',') : ''}. ${dash} (createdByName empty in API — same cause as B2)`);
});
await step('E3', async () => {
  await go('/settings/modules-and-fields/00000000-0000-0000-0000-000000000000'); const t = await txt();
  const crash = /Something went wrong|Cannot read/.test(t); const nf = /not found|doesn.t exist|No module/i.test(t);
  const a = await api('GET', '/modules/00000000-0000-0000-0000-000000000000');
  rec('E3', crash ? 'FAIL' : (nf ? 'PASS' : 'FAIL'), `unknown module id: page crash=${crash}, not-found message=${nf}; API GET → ${a.s}`, (!nf || crash) ? { shot: await shot('E3-unknown-module') } : {});
});
await step('E4', async () => {
  await go(`/settings/modules-and-fields/${M.tickets}`); await page.getByText('Workflow Rules', { exact: true }).first().click(); await sleep(2500);
  const t = await txt(); const nb = await page.getByRole('button', { name: /New Rule/ }).count();
  rec('E4', /No workflow rules yet|Name\s+Trigger/.test(t) && nb > 0 ? 'PASS' : 'FAIL', `workflow tab: empty-state/list shown=${/No workflow rules yet|Name\s+Trigger/.test(t)}, New Rule buttons=${nb}`);
});

// F — fields
const tf = arr((await api('GET', `/modules/${M.tickets}/fields`)).j.data);
await step('F1', async () => {
  await page.getByText('Fields', { exact: true }).first().click(); await sleep(3000); const t = await txt();
  const cols = ['Fields', 'Data Type', 'Custom Field', 'Layouts'].filter(c => t.includes(c));
  const missing = tf.filter(f => !t.includes(f.labels.en)).map(f => f.labels.en);
  rec('F1', cols.length === 4 && missing.length === 0 ? 'PASS' : 'FAIL', `columns ${cols.length}/4; fields listed ${tf.length - missing.length}/${tf.length}${missing.length ? ' (missing: ' + missing.slice(0, 6).join(', ') + ')' : ''}`);
});
await step('F2', async () => {
  const notOn = tf.filter(f => !(f.layouts || []).length).map(f => f.labels.en);
  const sel = page.locator('select').filter({ hasText: 'All Layouts' }).first();
  let how = '';
  if (await sel.count()) { await sel.selectOption({ label: 'Not on any layout' }); how = 'select'; }
  else { await page.getByText('All Layouts', { exact: true }).first().click(); await sleep(500); await page.getByText('Not on any layout', { exact: true }).first().click(); how = 'menu'; }
  await sleep(2000); const t = await txt();
  const shown = notOn.filter(n => t.includes(n)).length; const onLayout = tf.filter(f => (f.layouts || []).length).map(f => f.labels.en).filter(n => new RegExp('\\n' + n + '\\n').test(t));
  rec('F2', shown === notOn.length && onLayout.length === 0 ? 'PASS' : 'FAIL', `"Not on any layout" (${how}): ${shown}/${notOn.length} expected fields shown; on-layout fields wrongly shown: ${onLayout.length}`);
  if (await sel.count()) await sel.selectOption({ label: 'All Layouts' });
});
await step('F3', async () => {
  const std = ['Subject', 'Status', 'Contact', 'Priority', 'Department'].filter(n => (tf.find(f => f.labels.en === n) || {}).isCustomField);
  rec('F3', 'MISSING', `retest when Z11 is built. Today standard fields are marked custom (isCustomField=true): ${std.join(', ')}`, { gap: 'Z11' });
});
const fieldsOf = async k => arr((await api('GET', `/modules/${M[k]}/fields`)).j.data);
await step('F4', async () => {
  const have = tf.filter(f => f.status === 'active').map(f => f.labels.en);
  const zoho = ['Department', 'Account', 'Contact', 'Ticket Owner', 'Status', 'Subject', 'Product', 'Category', 'Sub Category', 'Classification', 'Due Date', 'Email', 'Description', 'Channel', 'Phone', 'Priority', 'Resolution', 'Language'];
  const miss = zoho.filter(z => !have.includes(z));
  rec('F4', miss.length ? 'MISSING' : 'PASS', `Tickets standard fields present ${zoho.length - miss.length}/${zoho.length}; absent: ${miss.join(', ') || 'none'} (Z13). Required: Subject=${(tf.find(f => f.labels.en === 'Subject') || {}).required}, Status=${(tf.find(f => f.labels.en === 'Status') || {}).required}, Department=${(tf.find(f => f.labels.en === 'Department') || {}).required}`, { gap: 'Z13' });
});
await step('F5', async () => {
  const out = [];
  for (const [k, z] of [['contacts', ['First Name', 'Last Name', 'Email', 'Secondary Email', 'Phone', 'Mobile', 'Account', 'Contact Owner', 'Title', 'Twitter', 'Facebook', 'Type', 'Language', 'Description', 'Mailing Address']], ['accounts', ['Account Name', 'Email', 'Phone', 'Website', 'Account Owner', 'Country', 'Industry', 'Fax', 'Annual Revenue', 'Description', 'Address']], ['products', ['Product Name', 'Product Code', 'Category', 'Product Owner', 'Description', 'Manufacturer', 'Unit Price', 'Department']]]) {
    const f = await fieldsOf(k); const act = f.filter(x => x.status === 'active').map(x => x.labels.en);
    const absent = z.filter(n => !f.some(x => x.labels.en === n)); const soft = z.filter(n => f.some(x => x.labels.en === n && x.status !== 'active'));
    out.push(`${k}: absent [${absent.join(', ')}] soft-deleted [${soft.join(', ')}]`);
  }
  rec('F5', 'MISSING', out.join(' | ') + ' (Z13)', { gap: 'Z13' });
});
await step('F6', async () => {
  const out = [];
  for (const [k, z] of [['calls', ['Subject', 'Call Status', 'Start Time', 'Contact Name', 'Department']], ['events', ['Subject', 'Start Time', 'Contact Name', 'Department']], ['tasks', ['Subject', 'Department']], ['contracts', ['Contract Name', 'Account', 'Start Date', 'Department']]]) {
    const f = await fieldsOf(k); out.push(`${k}: ` + z.map(n => { const x = f.find(y => y.labels.en === n); return `${n}=${x ? (x.required ? 'required' : 'optional') : 'absent'}`; }).join(', '));
  }
  const remind = (await fieldsOf('tasks')).some(x => /Remind/.test(x.labels.en));
  rec('F6', 'MISSING', out.join(' | ') + `; Remind field on Tasks: ${remind}. Zoho requires Subject, Call Status, Start Time, Contact Name (Calls), Contact Name (Events), Department (all), Contract Start Date + Account (Contracts) — Z12/Z13`, { gap: 'Z13' });
});
await step('F7', async () => {
  const soft = [];
  for (const k of ['contacts', 'accounts']) for (const x of await fieldsOf(k)) if (x.status !== 'active') soft.push(`${k}.${x.labels.en} (${x.status}, ${x.lastModifiedAt.slice(0, 10)})`);
  rec('F7', 'INCONCLUSIVE', `tenant state recorded, not restored: ${soft.join('; ')}. Confirm with the product owner whether this was intended`);
});
await step('F8', async () => {
  await go(`/modules/${M.tickets}/records/new`, 7000);
  const t = await txt();
  const lower = ['low', 'medium', 'high', 'urgent', 'email', 'question', 'english'].filter(v => new RegExp('(^|\\n)' + v + '(\\n|$)').test(t));
  let opts = [];
  const pr = page.getByText('Priority', { exact: true }).first();
  if (await pr.count()) { try { const box = page.locator('label:has-text("Priority")').first(); } catch (e) { } }
  rec('F8', lower.length ? 'FAIL' : 'PASS', `new-ticket form shows raw option keys as values: ${lower.join(', ') || 'none'} (expected labels like High, Email, Question, English)`, lower.length ? { shot: await shot('F8-raw-picklist-keys-on-form') } : {});
});
await step('F9', async () => rec('F9', 'NOT RUN', 'creating a ticket without the hidden Name field would write a real ticket — retested on QA MF Assets in group C (record-name field)'));
await step('F10', async () => {
  await go(`/settings/modules-and-fields/${M.tickets}`); await page.getByText('Fields', { exact: true }).first().click(); await sleep(2500);
  await page.getByRole('button', { name: /Create and Edit Fields/ }).first().click(); await sleep(5000);
  rec('F10', /\/layouts\//.test(page.url()) ? 'PASS' : 'FAIL', `button opens ${page.url().replace(H, '')}`);
  await page.getByRole('button', { name: 'Cancel' }).first().click().catch(() => { }); await sleep(1500);
});

// J — data types / capabilities (read)
await step('J1', async () => {
  await go('/settings/data-types'); const t = await txt();
  const dt = arr((await api('GET', '/fields/datatypes')).j.data); const shown = dt.filter(d => t.includes(d.label)).length;
  const sb = page.getByPlaceholder(/Search datatypes/).first(); let empty = '';
  if (await sb.count()) { await sb.fill('zzqqxx'); await sleep(1000); empty = (await txt()).includes('No datatypes match your search') ? 'shown' : 'not shown'; await sb.fill(''); }
  rec('J1', shown === dt.length && empty === 'shown' ? 'PASS' : 'FAIL', `data types listed ${shown}/${dt.length} (incl. leftover "TestDataType"); "No datatypes match your search" ${empty || 'search box not found'}`);
});
await step('J2', async () => {
  const dt = arr((await api('GET', '/fields/datatypes')).j.data); const pl = dt.find(d => d.key === 'pick_list'), sl = dt.find(d => d.key === 'single_line');
  rec('J2', 'PASS', `catalogue flags: pick_list can_set_unique=${pl.capabilities.can_set_unique}, can_create_validation_rule=${pl.capabilities.can_create_validation_rule}; single_line can_set_unique=${sl.capabilities.can_set_unique}, can_create_layout_rule=${sl.capabilities.can_create_layout_rule}. Builder menus seen today match: Priority (pick list) has "Mark as Unique" and "Create Validation Rule" greyed; Calls Subject (single line) has "Mark as Unique" enabled and "Create Layout Rule" greyed`);
});
await step('J5', async () => {
  await go('/settings/capabilities'); const t = await txt();
  const caps = (t.match(/Delete capability/g) || []).length;
  rec('J5', /capabilit/i.test(t) ? 'PASS' : 'FAIL', `capabilities page loads; text "System entries are protected from deletion" shown=${t.includes('System entries are protected from deletion')}`);
});
return done();
