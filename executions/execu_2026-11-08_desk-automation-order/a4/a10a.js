const r = await mkRule('A10', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', commentBody: 'QA AO WF A10 fired', commentPublic: false }]);
const t = await mkTicket('A10', {}, 'tenant check'); await sleep(12000);
const rule = (await api('GET', '/workflow/rules/' + r.id)).j?.data;
fs.writeFileSync('../a4/a10.json', JSON.stringify({ rule: r.id, t: t.id, name: rule.name, updatedAt: rule.updatedAt || rule.updated_at, isActive: rule.isActive, exec: (await execs(t.id)).filter(e => e.rule === r.id).length }, null, 1));
log(fs.readFileSync('../a4/a10.json', 'utf8'));
