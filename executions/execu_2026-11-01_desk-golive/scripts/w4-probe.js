const seen = {};
const onRes = async r => { const u = r.url(); if (!u.includes('/api/v1/') || r.request().method() !== 'GET') return; const k = u.replace(API, '').split('?')[0].replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ':id'); if (seen[k]) return; seen[k] = r.status(); };
page.on('response', onRes);
const pages = ['/settings/channels/email', '/settings/channels/web-forms', '/settings/channels/help-center', '/settings/channels/community', '/settings/organization/email-templates', '/settings/organization/customer-happiness', '/settings/integrations', '/knowledge-base', '/community', '/settings'];
const out = {};
for (const p of pages) { try { await go(p, 12000); const t = await txt(); out[p] = t.replace(/\s+/g, ' ').slice(0, 1500); } catch (e) { out[p] = 'ERR ' + e.message.slice(0, 80); } }
page.off('response', onRes);
return done({ out, seen });
