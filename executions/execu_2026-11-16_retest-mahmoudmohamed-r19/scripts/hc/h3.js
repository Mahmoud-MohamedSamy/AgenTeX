const M = s => String(s).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, '<e>'); const o = {};
const r = await api('POST', '/desk/community/categories', { name: 'QA RT19 HC 3007 cat', description: 'QA RT19 HC retest - safe to delete', department_ids: [CS], visibility: 'all_users', post_rule: 'registered_users', reply_rule: 'registered_users', moderation_mode: 'none', moderator_ids: [OWNER], auto_convert: true, default_department_id: CS, default_department: CS });
o.create = E(r); const id = r.j?.data?.id; o.id = id;
if (id) { made.other.push('category ' + id); keep(); LED('community category created ' + id + ' "QA RT19 HC 3007 cat" (Customer Support, auto_convert requested true)'); const g = r.j.data; o.got = M(JSON.stringify({d:g.departments,dd:g.default_department,ac:g.auto_convert,dis:g.disabled})); }
return o;
