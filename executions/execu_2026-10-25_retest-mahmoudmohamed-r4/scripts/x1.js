const n = await api('GET', '/notifications?limit=5'); const u = await api('GET', '/notifications/unread-count');
await go('/settings/integrations/crm', 10000); await page.getByRole('button', { name: 'Disconnect', exact: true }).first().click(); await sleep(1500); await shot('2399-r2-01-disconnect-dialog');
const d = page.locator('[role=dialog],[role=alertdialog]').last();
return done({ unread: u.j?.data, notif: arr(n.j?.data).map(x => ({ id: x.id, title: x.title || x.message || x.type, at: x.created_at })), dlg: await d.innerText().catch(() => 'none') });
