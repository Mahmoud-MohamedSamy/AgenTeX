// NDC-2406 read-only: did contact ffe47fd2 (29 Oct) ever get a Desk partner? Full integration config (contacts part + top-level), newest links.
const out = {}; const cid = 'ffe47fd2-e1b4-442a-a1dd-79144860ec2b';
let all = []; for (let p = 1; p <= 10; p++) { const l = arr((await api('o', 'GET', `desk:/desk/integrations/crm/links?kind=contact&page_size=200&page=${p}`)).j?.data); all.push(...l); if (l.length < 100) break; }
out.links = all.length; out.oldContactLinked = all.some(x => x.crm_record_id === cid);
out.newest = all.map(x => x.last_synced_at || x.created_at).sort().slice(-3);
const cf = (await api('o', 'GET', 'desk:/desk/integrations/crm/config')).j?.data;
out.contactsCfg = JSON.stringify({ ...cf?.contacts, mappings: (cf?.contacts?.mappings || []).length + ' mappings' }).slice(0, 600);
out.topLevel = Object.fromEntries(Object.entries(cf || {}).filter(([k, v]) => typeof v !== 'object' || v === null));
out.otherObjects = Object.keys(cf || {}).filter(k => cf[k] && typeof cf[k] === 'object');
const st = (await api('o', 'GET', 'desk:/desk/integrations/crm/status')).j?.data; out.status = Object.fromEntries(Object.entries(st || {}).filter(([k]) => !/module_id|app_url/.test(k)));
return out;
