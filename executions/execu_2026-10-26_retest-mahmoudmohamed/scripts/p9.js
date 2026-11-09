const out = {};
const tpl = (await api('GET', '/desk/email-templates')).j?.data; out.tplKeys = Object.keys(tpl || {}); out.tplSample = JSON.stringify((tpl.email_templates || [])[0]).slice(0, 600);
const r = await api('POST', '/desk/email-templates', {}); out.tplPostEmpty = r.s + ' ' + r.t.slice(0, 400);
const sk = await api('POST', '/desk/skills', {}); out.skillPostEmpty = sk.s + ' ' + sk.t.slice(0, 300);
const skp = await api('PUT', '/desk/skills', {}); out.skillPutEmpty = skp.s + ' ' + skp.t.slice(0, 300);
return fin(out);
