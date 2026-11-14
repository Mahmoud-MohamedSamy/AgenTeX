const SRC = '56a69b17-df26-4ecc-a5f6-77c95f75f39c', A2 = 'c0e196f8-7ad6-4978-a910-7ae0bf8513ca', T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd';
const g = () => api('GET', '/workflow/custom-actions/sources/' + SRC);
out.base = {};
for (const u of ['notaurl', 'ftp://example.com', 'http://example.com', 'http://localhost', 'http://127.0.0.1:1', 'http://169.254.169.254', 'http://10.0.0.5', 'http://[::1]', 'http://0x7f000001', 'https://webhook.site']) {
  const v = D((await g()).j).version; const r = await api('PUT', '/workflow/custom-actions/sources/' + SRC, { name: 'QA GL W3 echo API', baseUrl: u, version: v }); out.base[u] = r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 200) : 'saved ' + D(r.j)?.baseUrl);
  if (u === 'http://127.0.0.1:1' && r.s < 300) { const run = await api('POST', '/workflow/custom-actions/' + A2 + '/run', { runtimeInputs: { ref: 'QAREF-SSRF' }, context: { app: 'desk', moduleId: TM, recordId: T1, label: 'x' } }); out.runLocal = run.s + ' ' + JSON.stringify((D(run.j)?.steps || []).map(s => [s.url, s.outcome, s.error, s.friendlyError])).slice(0, 400); } }
out.final = D((await g()).j).baseUrl;
return fin({ out });
