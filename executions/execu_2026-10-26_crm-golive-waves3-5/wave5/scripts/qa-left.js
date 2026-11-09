const all = []; let cur = null; for (let p = 0; p < 20; p++) { const r = await call('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = Array.isArray(r.j.data) ? r.j.data : r.j.data.items; all.push(...d); cur = r.j.meta && r.j.meta.next_cursor; if (!cur || !d.length) break; }
const binQa = all.filter(x => /QA W5/i.test(x.record_label || '') || /qa_w5/.test(x.module_key || '')).map(x => x.module_key + ':' + x.record_label);
const clients = JSON.stringify((await call('GET', '/iam/integrations/clients')).j.data).match(/QA W5[^"]*/g);
const skillsCat = (await call('GET', '/iam/skills/catalog')).t.match(/QA W5[^"]*/g);
const u1 = (await call('GET', '/iam/skills/users/45ffbc5b-7859-4c21-be9e-7b5f30747ca2')).t.match(/QA W5[^"]*/g);
const layout = (await call('GET', '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/fields')).t.match(/qa_w5[^"]*/g);
return { binQa, clients, skillsCat, testUser1Skills: u1, qaFieldsOnLeads: layout };
