const W = JSON.parse(fs.readFileSync('../a4/webhook-token.json', 'utf8')).uuid; const TAG = process.env.O5TAG;
const rule = await mkRule('O5x', { kind: 'RecordCreated' }, [{ type: 'Webhook', method: 'POST', url: 'https://webhook.site/' + W + '/qa-ao-wf-o5x-' + TAG, bodyTemplate: '{"subject":"${subject}","description":"${description}","department":"${department}","email":"${email}"}', headers: {}, timeoutSeconds: 10 }]);
const t = await mkTicket('O5x', { description: TAG + '-only' }, TAG + ' tenant');
fs.writeFileSync('../a4/o5x-' + TAG + '.json', JSON.stringify({ rule: rule.id, rs: rule.s, err: rule.err, t: t.id, ts: t.s, terr: t.err }));
log(TAG, rule.s, rule.err || '', t.s, t.err || '');
