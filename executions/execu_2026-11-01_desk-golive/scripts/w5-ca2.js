const d = page.locator('[role=dialog]').last();
const spec = JSON.stringify({ openapi: '3.0.0', info: { title: 'QA GL W5 API', version: '1.0' }, servers: [{ url: 'https://example.com' }], paths: { '/qa-gl-w5': { get: { operationId: 'qaGlW5Action', summary: 'QA GL W5 action', responses: { 200: { description: 'ok' } } } } } });
await d.getByRole('tab', { name: 'Paste' }).click().catch(async () => await d.getByText('Paste', { exact: true }).click()); await sleep(1000);
await d.locator('textarea').first().fill(spec); await sleep(500);
await d.getByRole('button', { name: /^Parse$/ }).click().catch(() => {}); await sleep(3000);
out.s1 = (await dtxt()).slice(0, 500);
await d.getByRole('button', { name: /^Continue$/ }).click(); await sleep(3000); out.s2 = (await dtxt()).slice(0, 700); await shot('w5/W5-64-ops');
return fin({ out });
