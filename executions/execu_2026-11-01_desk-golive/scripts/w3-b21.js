const SRC = '56a69b17-df26-4ecc-a5f6-77c95f75f39c', A2 = 'c0e196f8-7ad6-4978-a910-7ae0bf8513ca', T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd';
const g = () => api('GET', '/workflow/custom-actions/sources/' + SRC); out.run = {};
for (const u of ['http://localhost:1', 'http://169.254.169.254:1', 'http://10.0.0.5:1', 'http://192.168.1.1:1', 'http://[::1]:1', 'http://0x7f000001:1', 'http://2130706433:1', 'http://127.1:1', 'http://localtest.me:1']) {
  const v = D((await g()).j).version; const s = await api('PUT', '/workflow/custom-actions/sources/' + SRC, { name: 'QA GL W3 echo API', baseUrl: u, version: v });
  if (s.s >= 300) { out.run[u] = 'save ' + s.s + ' ' + s.t.slice(0, 120); continue; }
  const run = await api('POST', '/workflow/custom-actions/' + A2 + '/run', { runtimeInputs: { ref: 'QAREF-SSRF' }, context: { app: 'desk', moduleId: TM, recordId: T1, label: 'x' } });
  out.run[u] = JSON.stringify((D(run.j)?.steps || []).map(s => [s.outcome, s.error, s.friendlyError, s.durationMs])).slice(0, 220); }
const v = D((await g()).j).version; out.restore = (await api('PUT', '/workflow/custom-actions/sources/' + SRC, { name: 'QA GL W3 echo API', baseUrl: 'https://webhook.site', version: v })).s; out.final = D((await g()).j).baseUrl;
return fin({ out });
