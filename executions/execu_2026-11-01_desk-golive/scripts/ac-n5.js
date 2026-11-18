await go('/settings/customization/notifications', 10000);
const sw = page.getByRole('switch', { name: 'Department Notifications — Email: Receiving a shared ticket' }); await sw.scrollIntoViewIfNeeded(); await sw.click(); await sleep(3000);
out.state = await sw.getAttribute('aria-checked'); out.toast = await toasts(); out.net = NET.filter(n => !/notif\?|resolved|presence/.test(n.u)).map(n => n.m + ' ' + n.s + ' ' + n.u.slice(0, 100) + ' ' + n.b.slice(0, 150)).slice(-3);
return fin({ out });
