const rules = arr((await api('GET', `/workflow/rules?moduleId=${T}&limit=200`)).j?.data);
const me = (await api('GET', '/iam/users/me')).j?.data;
return done({ n: rules.length, qa: rules.filter(r => /^QA/.test(r.name)).map(r => r.name), me: me && { id: me.id, email: me.email?.replace(/@.*/, '@…') }, sampleTicketEvent: rules.filter(r => r.trigger?.kind === 'TicketEvent').slice(0, 3).map(r => r.trigger) });
