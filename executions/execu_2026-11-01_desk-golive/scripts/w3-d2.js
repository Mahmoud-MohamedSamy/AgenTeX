const T2 = '53c188f7-9e88-42b3-8d3a-515dfdc31f61';
const st = async () => { const t = D((await api('GET', '/desk/tickets/' + T2)).j) || {}; return Object.fromEntries(Object.entries(t).filter(([k]) => /archiv/i.test(k))); };
out.before = await st();
await go('/views/all/tickets/' + T2, 12000); await page.locator('#main-content').getByRole('button', { name: 'More ticket actions' }).click(); await sleep(1200); await page.getByRole('menuitem', { name: 'Archive' }).click(); await sleep(2500);
const dl = page.locator('[role=dialog],[role=alertdialog]'); if (await dl.count()) { out.dlg = (await dl.last().innerText()).replace(/\s+/g, ' ').slice(0, 300); await dl.last().getByRole('button', { name: /Archive/ }).last().click().catch(() => {}); await sleep(2500); }
out.toast = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | '); await shot('w3/W3-27-archived');
out.afterArchive = await st();
const r = await api('POST', '/desk/tickets/' + T2 + '/replies', { mode: 'reply', to: ['qa-gl-w3-c1@example.com'], cc: [], bcc: [], subject: 'Re: QA GL W3 plan ticket 2', body_html: '<p>QA GL W3 agent reply on an archived ticket</p>' }); out.reply = r.s + ' ' + r.t.slice(0, 250);
if (r.s >= 300) { const c = await api('POST', '/desk/tickets/' + T2 + '/comments', { body_html: '<p>QA GL W3 comment on archived ticket</p>', is_public: false }); out.comment = c.s + ' ' + c.t.slice(0, 150); }
await sleep(5000); out.afterReply = await st();
await go('/views/all/tickets/' + T2, 10000); out.page = ((await mtxt()).match(/.{0,80}rchiv.{0,120}/gi) || []).slice(0, 3); await shot('w3/W3-27-after-reply');
return fin({ out });
