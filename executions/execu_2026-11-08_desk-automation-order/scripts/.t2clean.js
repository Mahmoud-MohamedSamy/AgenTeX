const o = JSON.parse(fs.readFileSync('../a4/o5x-anyware.json'));
const R = { rule: (await api('DELETE', '/workflow/rules/' + o.rule)).s, ticket: (await api('DELETE', '/modules/e8e5e302-3873-4e32-b945-c9cd25c7659d/records/' + o.t)).s };
R.rulesNow = arr((await api('GET', '/workflow/rules?take=500')).j?.data).length;
const c = arr((await api('GET', '/modules/0bbb599e-013b-4465-a41e-85a324a4e3ac/records?take=50&sort=-created_at')).j?.data); R.newContactsQa = JSON.stringify(c).includes('qaao');
log(JSON.stringify(R));
