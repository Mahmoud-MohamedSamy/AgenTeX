const o = {}; const ME = '7017d261-36ee-4e2f-9e60-2310ece52ef8';
const f = await api('GET', '/audit/events/facets'); const et = (f.j.data.entity_types || []).map(x => x.entity_type || x.value || x.key || x);
o.entityTypes = et.filter(x => /depart|team|profile|role|org|business|holiday|company|brand|tenant|user|invit/i.test(String(x))).join(',');
const ids = { 'QA GL Dept': '0d3c1585-5df2-40c2-894c-752cbdaead08', 'QA GL Team 2': 'd0a38429-33dd-4688-b533-82e472e552cc', 'QA GL Role': '52fd2a65-9ee9-43b7-b1e7-8d10c4c3bd8c', 'QA GL Profile': 'c83dddbf-983a-4c09-b004-bbfbbfe0fe6b', 'QA GL Child': '9b2c929a-51f3-4f3f-a98a-ed76ddc07597', 'QA GL BH': '8594d6e4-0eb6-4060-8333-751080e52068', 'QA GL Holidays': '9c0d5bec-ad22-4660-b315-30f562a113b6', 'company': 'ae3d7a04-54c5-4852-852a-1d74b60d7d1c' };
let all = []; let cursor = null;
for (let i = 0; i < 15; i++) { const r = await api('GET', '/audit/events?limit=100&from=2026-11-01T21:20:00Z&actor_user_id=' + ME + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); if (r.s !== 200) { o.pageErr = r.s; break; } all = all.concat(r.j.data || []); cursor = r.j.meta && r.j.meta.next_cursor; if (!cursor) break; }
o.scanned = all.length;
for (const [k, id] of Object.entries(ids)) { const m = all.filter(e => e.target_id === id || JSON.stringify(e.changes || '').includes(id)); o[k] = m.map(e => e.action.replace('audit.action.', '') + ':' + e.target_type).join(','); }
return done(o);
