const fs = require('fs');
let s = fs.readFileSync('rc.js', 'utf8');
s = s.split('Bearers+').join('Bearer\s+');
fs.writeFileSync('rc.js', s);
let p = fs.readFileSync('prelude.js', 'utf8');
p = p.replace("const ensureAuth = async () => { if (!hdr) {", "const ensureAuth = async () => { if (!hdr) { const ck = (await page.context().cookies()).find(c => c.name === 'aw_staging_access_token'); if (ck) { hdr = { authorization: 'Bearer ' + ck.value, 'x-app-key': 'crm' }; return; } }\n  if (!hdr) {");
fs.writeFileSync('prelude.js', p);
