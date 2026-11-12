// W5-09 account + link contact
out.acc = await mk(AM, 'account', 'QA GL W5 Account', { account_name: 'QA GL W5 Account', website: 'https://example.com', phone: '+201000000520', department: MK });
out.acc2 = await mk(AM, 'account', 'QA GL W5 Account Parent', { account_name: 'QA GL W5 Account Parent' });
if (out.acc.id) { const p = await api('PATCH', '/modules/' + CM + '/records/' + C1, { data: [{ field: 'account_id', value: sv(out.acc.id) }] }); out.link = p.s + ' ' + (p.s >= 300 ? p.t.slice(0, 200) : ''); }
// W5-13 ticket for contact 1 (no priority, to avoid tenant rules)
const t = await api('POST', '/modules/' + TM + '/records', { data: [{ field: 'subject', value: sv('QA GL W5 ticket for contact 1') }, { field: 'department', value: sv(MK) }, { field: 'contact_id', value: sv(C1) }, { field: 'email', value: sv('qa-gl-w5-c1@example.com') }] });
out.ticket = t.s + ' ' + (t.s >= 300 ? t.t.slice(0, 250) : ''); const tid = t.j && t.j.data && t.j.data.id; if (tid) { CREATED.push({ kind: 'ticket', id: tid, name: 'QA GL W5 ticket for contact 1' }); out.tid = tid; }
// support plans in Marketing
const sp = await api('GET', '/desk/sla/support-plans'); out.plans = arr(D(sp.j)).map(x => [x.id, x.name, x.department_id || (x.department && x.department.id) || '', x.status || x.is_active].join(' | ')).slice(0, 12);
await sleep(3000);
if (out.acc.id) { await go('/modules/' + AM + '/customers/' + out.acc.id, 9000); out.accPage = (await mtxt()).slice(0, 700); await shot('w5/W5-14-account-page');
  for (const tab of ['Contacts', 'Tickets']) { const tb = page.locator('main').getByText(tab, { exact: true }).first(); if (await tb.count()) { await tb.click().catch(() => {}); await sleep(3000); out['acc' + tab] = (await mtxt()).slice(0, 400); } } await shot('w5/W5-09-account-contacts'); }
await go('/modules/' + CM + '/customers/' + C1, 9000); out.c1Page = (await mtxt()).slice(0, 500); await shot('w5/W5-13-contact-360');
// W5-10 parent field? W5-11 account duplicates button
await go('/modules/' + AM, 8000); out.accList = (await mtxt()).slice(0, 300);
await page.getByRole('button', { name: /Find duplicates/i }).first().click().catch(e => out.fdErr = e.message.slice(0, 60)); await sleep(4000); out.accDup = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await page.keyboard.press('Escape');
// W5-12 badge tooltip
const badge = page.getByText('Unlinked', { exact: true }).first(); if (await badge.count()) { await badge.hover(); await sleep(1500); out.badgeTip = (await page.locator('[role=tooltip]').allInnerTexts()).join(' / ').slice(0, 300); await shot('w5/W5-12-badge'); }
return fin({ out });
