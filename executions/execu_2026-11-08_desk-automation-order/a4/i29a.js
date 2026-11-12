// I29 prep (user OK to change + revert): ratings ON, rule Send happiness email, ticket to the QA mailbox.
const hs = (await api('GET', '/desk/happiness/settings')).j?.data; fs.writeFileSync('../a4/happiness-orig-i29.json', JSON.stringify(hs, null, 1));
const on = await api('PUT', '/desk/happiness/settings', { ...hs, is_enabled: true });
const rule = await mkRule('I29', { kind: 'RecordCreated' }, [{ type: 'SendHappinessEmail' }]);
const t = await mkTicket('I29', {}, 'please rate'); await sleep(20000);
const g = await getTicket(t.id); const ex = await execs(t.id);
fs.writeFileSync('../a4/i29.json', JSON.stringify({ rule: rule.id, ticket: t.id, number: g.ticket_number }, null, 1));
log({ happinessOn: on.s, rule: rule.s + (rule.err || ''), ticket: g.ticket_number, subject: g.subject, to: g.email, ex });
