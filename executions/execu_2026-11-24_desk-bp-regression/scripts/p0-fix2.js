const MADE = '../made.json';
const made = JSON.parse(fs.readFileSync(MADE, 'utf8'));
const keep = () => fs.writeFileSync(MADE, JSON.stringify(made, null, 1));
const o = {};
const teams = (await api('GET', '/desk/teams')).j?.data?.teams || [];
const withSrc = teams.filter(t => (t.sources || []).length).slice(0, 2);
o.sampleSources = withSrc.map(t => ({ name: t.name, sources: t.sources }));
if (withSrc[0]) { const one = (await api('GET', '/desk/teams/' + withSrc[0].id)).j?.data; o.sampleMembers = (one.member_user_ids || []).length; }
if (!made.other.find(x => x.kind === 'template')) {
  for (const uc of [undefined, 'custom']) {
    const body = { name: 'QA BP Reg template', module: 'desk_tickets', notification_type: 'contact', subject: 'QA BP Reg #{{ticket.number}} {{ticket.subject}}', body_html: '<p>QA BP Reg: ticket {{ticket.subject}} moved in its blueprint.</p>' };
    if (uc) body.use_case = uc;
    const r = await api('POST', '/desk/email-templates', body);
    o['tpl ' + (uc || 'none')] = r.s + ' ' + JSON.stringify(r.j?.error || '').slice(0, 200);
    if (r.j?.data?.id) { made.other.push({ kind: 'template', id: r.j.data.id, name: 'QA BP Reg template', use_case: uc || null }); keep(); break; }
  }
}
return o;
