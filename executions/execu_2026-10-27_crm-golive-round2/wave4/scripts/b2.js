// Round 2 Wave 4 batch 2: web-form links and portal link, opened without signing in (plain fetch, no cookies).
const C = JSON.parse(require_registry);
const out = {};
const f = await call('GET', `/web-forms/${C.form}`);
const d = f.j && f.j.data || {};
out.formKeys = Object.keys(d); out.embed_key = d.embed_key; out.share = JSON.stringify(d.share || d.links || d.public_url || d.share_url || null).slice(0, 300);
const HOST = 'https://staging-crm.taviportal.com';
const pub = async u => { try { const r = await fetch(u, { redirect: 'follow' }); const t = await r.text(); return r.status + ' ' + (t.match(/<title>[^<]*<\/title>/i) || [''])[0] + ' ' + (/nginx/i.test(t) ? 'NGINX ' : '') + t.replace(/\s+/g, ' ').slice(0, 120); } catch (e) { return 'ERR ' + e.message; } };
out.hosted = await pub(`${HOST}/embed/feedback/f/${d.embed_key}`);
out.embedFrame = await pub(`${HOST}/embed/feedback/index.html?key=${d.embed_key}&mode=frame`);
// find every URL-like string in the form detail (hosted link, qr)
out.urls = [...new Set(JSON.stringify(d).match(/https?:\/\/[^"\\]+/g) || [])].slice(0, 10);
for (const u of out.urls.filter(u => /staging|tavi/.test(u))) out['pub ' + u.slice(0, 90)] = await pub(u);
// portal: switch on, read its link, open it, switch off
const pOn = await call('PATCH', `/record-portals/${C.portal}`, { is_enabled: true }); out.portalOn = pOn.s + ' ' + pOn.t.slice(0, 150);
const p = await call('GET', `/record-portals/${C.portal}`); const pd = p.j && p.j.data || {};
out.portalUrls = [...new Set(JSON.stringify(pd).match(/https?:\/\/[^"\\]+|\/portal\/[^"\\]+/g) || [])].slice(0, 6); out.portalKeys = Object.keys(pd);
const key = pd.public_key || pd.key || pd.slug || pd.portal_key || pd.id;
out.portalByKey = await pub(`${HOST}/portal/${key}`);
for (const u of out.portalUrls) out['portal ' + u.slice(0, 80)] = await pub(u.startsWith('http') ? u : HOST + u);
const pOff = await call('PATCH', `/record-portals/${C.portal}`, { is_enabled: false }); out.portalOff = pOff.s;
out.portalOffOpen = await pub(`${HOST}/portal/${key}`);
return out;
