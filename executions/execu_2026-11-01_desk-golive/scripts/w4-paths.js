const js = new Set();
const onR = r => { const u = r.url(); if (/\.js(\?|$)/.test(u)) js.add(u); };
page.on('response', onR);
for (const p of ['/settings/channels/email', '/settings/channels/web-forms', '/settings/channels/help-center', '/settings/channels/community', '/settings/organization/email-templates', '/settings/organization/customer-happiness', '/settings/self-service/help-widgets', '/knowledge-base', '/community']) { try { await go(p, 9000); } catch (e) {} }
page.off('response', onR);
const found = new Set();
for (const u of js) { try { const r = await page.context().request.get(u, { timeout: 30000 }); const t = await r.text(); for (const m of t.matchAll(/[`"'](\/(?:desk\/(?:channels|kb|community|happiness|email-templates|help|widgets|web)|web-forms|help-centers|help-widgets|mail\/(?:connections|suppress|block|spam))[^`"'\s]{0,90})[`"']/g)) found.add(m[1]); for (const m of t.matchAll(/`(\/(?:desk\/(?:channels|kb|community|happiness|email-templates)|web-forms|help-centers|help-widgets)[^`]{0,90})`/g)) found.add(m[1]); } catch (e) {} }
return done({ n: js.size, paths: [...found].sort() });
