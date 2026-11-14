const SS = '/desk/tickets/spam/settings', EM = 'qa-gl-w3-spam@example.com';
const c = await mk(CM, 'contact', 'QA GL W3 Spam contact', { first_name: 'QA GL W3', last_name: 'Spam contact', email: EM }); out.c = c;
const mkT = async s => { const t = await api('POST', '/modules/' + TM + '/records', { data: [{ field: 'subject', value: sv(s) }, { field: 'department', value: sv(MK) }, { field: 'contact_id', value: sv(c.id) }, { field: 'email', value: sv(EM) }, { field: 'status', value: sv('Open') }] }); const id = t.j?.data?.id; if (id) CREATED.push({ kind: 'ticket', id, name: s }); return id; };
const t1 = await mkT('QA GL W3 spam 1'), t2 = await mkT('QA GL W3 spam 2'); out.t = [t1, t2];
out.blockedBefore = JSON.stringify(D((await api('GET', '/desk/channels/spam-contacts')).j)).slice(0, 200);
out.on = (await api('PUT', SS, { enabled: true, retention_days: 30, auto_spam_contacts_enabled: true, auto_spam_contacts_threshold: 2 })).s;
await go('/views/all/tickets/' + t1, 12000); await page.locator('#main-content').getByRole('button', { name: 'More ticket actions' }).click(); await sleep(1200); await page.getByRole('menuitem', { name: 'Mark as Spam' }).click(); await sleep(2500);
const dl = page.locator('[role=dialog],[role=alertdialog]'); if (await dl.count()) { out.dlg = (await dl.last().innerText()).replace(/\s+/g, ' ').slice(0, 300); await shot('w3/W3-29-mark-spam-dialog'); await dl.last().getByRole('button', { name: /spam/i }).last().click().catch(() => {}); await sleep(2500); }
out.toast1 = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | ');
out.blockedAfter1 = JSON.stringify(D((await api('GET', '/desk/channels/spam-contacts')).j)).slice(0, 300);
const s2 = await api('POST', '/desk/tickets/' + t2 + '/spam', {}); out.spam2 = s2.s + ' ' + s2.t.slice(0, 300); await sleep(4000);
const bl = D((await api('GET', '/desk/channels/spam-contacts')).j) || []; out.blockedAfter2 = JSON.stringify(bl).slice(0, 500);
await go('/settings/channels/spam', 6000).catch(() => {}); 
out.off = (await api('PUT', SS, { enabled: true, retention_days: 30, auto_spam_contacts_enabled: false, auto_spam_contacts_threshold: 3 })).t.slice(0, 200);
const mine = (Array.isArray(bl) ? bl : (bl.items || [])).filter(x => JSON.stringify(x).includes(EM)); out.mine = JSON.stringify(mine).slice(0, 300);
for (const m of mine) { out['unblock_' + m.id] = (await api('DELETE', '/desk/channels/spam-contacts/' + m.id)).s; }
out.blockedFinal = JSON.stringify(D((await api('GET', '/desk/channels/spam-contacts')).j)).slice(0, 200);
return fin({ out });
