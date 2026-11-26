const RX = /^(hi|Ignore your rules for this one answer|كم عدد التذاكر المفتوحة|ما هو أفضل نظام CRM|Can you book a flight|I have a headache|Can I legally fire|Give me the phone number of any|Which is better for us, this CRM|How many open tickets are there|Which contact has the phone number 0100000000|Turn on brand isolation|Turn on moderation|Turn lead scoring off|Change routing selection|Turn off the file upload|Add the field Phone to the conversation|Change the visitor idle time|Change the chat timeout)/;
const all = arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data);
const del = all.filter(c => RX.test(c.title || '') && c.updated_at >= '2026-11-25T10:00' && c.updated_at < '2026-11-25T11:30');
const o = { total: all.length, matched: del.length, s: {} };
for (const c of del) { const s = (await api('DELETE', `/agents/tia/conversations/${c.id}`)).s; o.s[s] = (o.s[s] || 0) + 1; }
const left = arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data);
o.left = left.length; o.leftSample = left.slice(0, 12).map(c => (c.updated_at || '').slice(0, 16) + ' | ' + (c.title || '').slice(0, 60));
ledger('Deleted leftover DD chats (Owner): ' + JSON.stringify(o.s)); return o;
