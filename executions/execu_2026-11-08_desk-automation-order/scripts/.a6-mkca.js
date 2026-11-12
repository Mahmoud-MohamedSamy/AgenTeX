const W = JSON.parse(fs.readFileSync('../a4/webhook-token.json', 'utf8')).uuid;
const spec = JSON.stringify({ openapi: '3.0.0', info: { title: 'QA BP echo', version: '1' }, servers: [{ url: 'https://webhook.site/' }], paths: { ['/' + W + '/qa-bp-ca']: { get: { operationId: 'qaBpEcho', responses: { '200': { description: 'ok' } } } } } });
const r = await api('POST', '/workflow/custom-actions/sources', { name: 'QA BP echo source', baseUrl: 'https://webhook.site/', specFormat: 'openapi3', origin: 'paste', spec, specText: spec, content: spec, authKind: 'none' });
const SID = r.j?.data?.id; const R = { src: r.s + (SID ? '' : ' ' + r.t.slice(0, 250)) };
if (SID) { const ca = await api('POST', '/workflow/custom-actions', { sourceId: SID, name: 'QA BP echo', description: 'A6 blueprint F7/K13, delete after', method: 'GET', path: '/' + W + '/qa-bp-ca', targetApps: ['desk'], status: 'active', inputBindings: [], dependencies: [], errorMappings: [], outputMappings: [] });
  const CA = ca.j?.data?.id; R.ca = ca.s + (CA ? '' : ' ' + ca.t.slice(0, 250)); if (CA) R.pub = (await api('POST', `/workflow/custom-actions/${CA}/publish`, {})).s;
  fs.writeFileSync('../a6/custom-action.json', JSON.stringify({ SID, CA })); }
log(JSON.stringify(R));
