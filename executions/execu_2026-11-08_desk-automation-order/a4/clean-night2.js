const S = JSON.parse(fs.readFileSync('../a4/e2e134.json'));
const d = await api('DELETE', '/desk/tags/' + S.made.tags[0]); log('tagDel', d.s, d.t.slice(0, 300));
const tj = (await api('GET', '/desk/tags?take=500')).j?.data; const TL = Array.isArray(tj) ? tj : (tj?.tags || tj?.items || []);
log('qaTags', JSON.stringify(TL.filter(t => /^QA WF/.test(t.name)).map(t => ({ id: t.id.slice(0, 8), n: t.name, dept: (t.department_id || '').slice(0, 8), at: t.created_at }))));
const tp = ((await api('GET', '/desk/email-templates?take=200')).j?.data?.email_templates || []).filter(t => /^QA AO WF/.test(t.name)); log('tpl', JSON.stringify(tp.map(t => ({ id: t.id, n: t.name, at: t.created_at }))));
