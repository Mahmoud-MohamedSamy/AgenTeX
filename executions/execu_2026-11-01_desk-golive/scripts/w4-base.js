const P = ['/desk/channels/addresses','/desk/channels/domains','/desk/channels/from-addresses','/desk/channels/mailboxes','/desk/channels/quarantine','/desk/channels/settings','/desk/channels/spam-contacts','/desk/channels/suppressions','/mail/connections','/desk/email-templates?limit=200','/desk/email-templates/folders','/web-forms','/help-centers','/desk/kb/categories','/desk/kb/articles','/desk/kb/settings','/desk/kb/article-templates','/desk/kb/category-groups','/desk/community/categories','/desk/community/settings','/desk/community/topics','/desk/happiness/settings','/desk/workflow-rules','/workflow-rules?module_id=88e8ea44-1658-4df3-9930-d0902b91073d','/desk/workflows'];
const b = {};
for (const p of P) { const r = await api('GET', p); b[p] = { s: r.s, j: r.j }; }
const hc = arr(b['/help-centers'].j)[0];
if (hc) for (const s of ['', '/designs', '/accounts', '/widgets', '/settings', '/seo', '/access']) { const r = await api('GET', '/help-centers/' + hc.id + s); b['/help-centers/:id' + s] = { s: r.s, j: r.j }; }
const BASE = b;
const sum = {}; for (const [k, v] of Object.entries(b)) { const d = v.j && v.j.data; sum[k] = v.s + ' ' + (Array.isArray(d) ? 'n=' + d.length : d && typeof d === 'object' ? Object.keys(d).slice(0, 12).join(',') : ''); }
return fin({ sum, BASE });
