// O5 (same-tenant half): two tickets fire one webhook rule at the same time; each body must carry only its own ticket.
const W = JSON.parse(fs.readFileSync('../a4/webhook-token.json', 'utf8')).uuid;
const rule = await mkRule('O5', { kind: 'RecordCreated' }, [{ type: 'Webhook', method: 'POST', url: 'https://webhook.site/' + W + '/qa-ao-wf-o5', bodyTemplate: '{"subject":"${subject}","description":"${description}","priority":"${priority}"}', headers: {}, timeoutSeconds: 10 }]);
const [a, b] = await Promise.all([mkTicket('O5', { description: 'alpha-only', priority: 'low' }, 'alpha'), mkTicket('O5', { description: 'bravo-only', priority: 'high' }, 'bravo')]);
await sleep(30000);
const h = await fetch('https://webhook.site/token/' + W + '/requests?sorting=newest&per_page=20').then(r => r.json()).catch(() => ({}));
const bodies = (h.data || []).filter(x => /qa-ao-wf-o5/.test(x.url || '')).map(x => x.content);
const ok = bodies.length === 2 && bodies.every(c => { const j = JSON.parse(c); return (/alpha/.test(j.subject) && j.description === 'alpha-only' && !/bravo/.test(c)) || (/bravo/.test(j.subject) && j.description === 'bravo-only' && !/alpha/.test(c)); });
log({ rule: rule.s, bodies, eachOnlyOwnRecord: ok });
