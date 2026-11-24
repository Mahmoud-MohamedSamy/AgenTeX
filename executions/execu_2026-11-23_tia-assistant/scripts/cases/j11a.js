const r = await ask('Create a new contact: first name QA TIA, last name J11b Expiry, email qa.tia.j11b@example.com.');
const c = (r.final?.pending_actions || [])[0];
fs.writeFileSync(RUN + '/out/j11b-card.json', JSON.stringify({ id: c?.id, exp: c?.expires_at, made: new Date().toISOString() }));
return { id: c?.id, exp: c?.expires_at };
