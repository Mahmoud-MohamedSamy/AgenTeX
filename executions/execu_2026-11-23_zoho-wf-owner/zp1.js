await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(15000);
out.url = page.url().replace(/[?#].*$/, '');
const api = (m, p, b) => page.evaluate(async ([m, p, b]) => { const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined, credentials: 'include' }); return { s: r.status, t: (await r.text()).slice(0, 400) }; }, [m, p, b]);
const B = '/supportapi/zd/techegysolutions/api/v1/';
const deps = await api('GET', B + 'departments?limit=10'); out.departments = deps.s + ' ' + deps.t.slice(0, 300);
for (const p of ['workflowRules?module=Cases', 'workflows?module=tickets', 'automations/workflows?module=Cases', 'workflowRules']) { const r = await api('GET', B + p); out[p] = r.s + ' ' + r.t.slice(0, 200); }
const tk = await api('GET', B + 'tickets?limit=1'); out.ticket = tk.s + ' ' + tk.t.slice(0, 400);
