// node redact.js <file.json>: drops auth/refresh/realtime/resolved-batch captures and masks any token values left.
const fs = require('fs'); const p = process.argv[2];
let j = JSON.parse(fs.readFileSync(p, 'utf8'));
if (Array.isArray(j)) j = j.filter(x => !/\/iam\/auth|realtime-ticket|resolved-batch/.test(x.u || ''));
let s = JSON.stringify(j, null, 1);
s = s.replace(/(access_token|refresh_token|ticket|password)(\?"\s*:\s*\?")[^"\]+/g, '$1$2<redacted>').replace(/eyJ[A-Za-z0-9_\-]{20,}\.[A-Za-z0-9_\-.]+/g, '<jwt-redacted>').replace(/awt1\.[A-Za-z0-9_\-]+/g, '<ticket-redacted>');
fs.writeFileSync(p, s);
