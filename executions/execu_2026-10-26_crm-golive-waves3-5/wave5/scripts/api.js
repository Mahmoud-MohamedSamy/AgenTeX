// Shared prelude for run-code snippets (owner browser session). No secrets printed or written.
const B = 'https://staging-crm.taviportal.com/api/v1';
const ck = (await page.context().cookies()).find(c => c.name === 'aw_staging_access_token');
const H = { authorization: 'Bearer ' + ck.value, 'x-app-key': 'crm', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004' };
const rq = page.context().request;
const call = async (m, p, body) => { const r = await rq.fetch(B + p, { method: m, headers: { ...H, ...(body !== undefined ? { 'content-type': 'application/json' } : {}) }, data: body !== undefined ? JSON.stringify(body) : undefined, failOnStatusCode: false });
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status(), j, t: t.slice(0, 2000) }; };
const MODS = { leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', contacts: '6f553963-01d6-4b68-9fb3-143d23044c41', deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', accounts: 'b2398920-2914-4836-be53-81bd960effea', tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', calls: 'e72e608a-a5d3-45cf-888a-dfadc6e8b456', meetings: 'f13e02be-03d3-46c3-a74e-22c7770823ca', subscriptions: '6d053261-6a93-4042-8496-19eeac878e32', agency: '30aba3c3-967a-4b47-962e-b4c0771c1250', services: 'eae451c0-aca2-40e9-87c5-8640e9a47325', dailymove: 'ad7879e0-69b0-4e73-a2a7-3be6ca155285', cases: '64d25249-e282-49a6-ad9d-c840004ede0d', po: '8fcdd3c2-5f97-4da6-a0bb-cc566285d14c', so: '91bb42eb-2f8e-4738-b3be-ffd465aee569', ndcagencies: '6e0e9833-4e32-4940-ab21-683cb7bc17d2' };
