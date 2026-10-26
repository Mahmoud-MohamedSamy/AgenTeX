const B = '/desk/integrations/crm';
const c = (await api('GET', `${B}/config`)).j.data; const b = JSON.parse(JSON.stringify(c)); delete b.status; b.panel.profile_access = [];
const r = await api('PUT', `${B}/config`, b);
const now = (await api('GET', `${B}/config`)).j.data; const base = require_base = null;
return done({ put: r.s, profile_access: now.panel.profile_access });
