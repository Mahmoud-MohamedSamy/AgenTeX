const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]';
const ids = JSON.parse(require('fs').readFileSync('../out/ids.json', 'utf8'));
const LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const R = {};
const btn = label => page.locator(`${P} button[aria-label="${label}"], ${P} button[title="${label}"]`).first();
const openPanel = async () => { if (!(await page.locator(P).count())) { await page.locator(L).click(); await sleep(1500); } };
const newChat = async () => { await openPanel(); if (await btn('New chat').count()) { await btn('New chat').click(); await sleep(1500); } };
const waitReply = async n => { await page.waitForFunction(k => document.querySelectorAll('[data-testid="tia-reply"]').length >= k && !document.querySelector('[data-testid="tia-thinking"]'), n, { timeout: 120000 }).catch(() => {}); await sleep(2500); };
const lastReply = async () => (await page.locator('[data-testid="tia-reply"]').last().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 900);
// N1-04 AI Features via menu click
await go('/settings'); await sleep(3000);
await page.getByText('AI Features', { exact: true }).first().click().catch(e => log('click fail', String(e).slice(0, 100))); await sleep(5000);
const at = await text(); await shot('N1-04-crm-ai-features', { fullPage: true });
const sw = await page.locator('[role=switch], input[type=checkbox]').evaluateAll(els => els.map(e => { let n = e; let lab = ''; for (let i = 0; i < 4 && n; i++) { n = n.parentElement; if (n && n.innerText && n.innerText.length < 300) lab = n.innerText; } return { label: lab.replace(/\s+/g, ' ').slice(0, 120), on: e.getAttribute('aria-checked') ?? String(e.checked) }; }));
R.n104 = { url: page.url().replace(/[?#].*/, ''), tiaLines: at.split('\n').filter(l => /tia/i.test(l)).slice(0, 8), tiaSwitches: sw.filter(s => /tia/i.test(s.label)), count: sw.length };
// N1-08 report page suggestion
await go('/reports'); await sleep(5000);
const rep = page.locator('a[href*="/reports/"]').first(); R.repHref = await rep.getAttribute('href').catch(() => null);
if (R.repHref) { await go(R.repHref); await sleep(6000); await newChat(); R.n108report = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 500); await shot('N1-08-crm-report-suggestions'); }
// N1-09 Summarise this record on the lead
await go(`/modules/${LEADS}/records/${ids.lead}`); await sleep(4000); await newChat();
const s1 = page.locator(`${P} button`, { hasText: 'Summarise this record' });
R.n109has = await s1.count();
if (R.n109has) { await s1.first().click(); await waitReply(1); R.n109 = await lastReply(); R.n109refs = await page.locator('[data-testid="tia-refs"] a, [data-testid="tia-refs"] button').evaluateAll(a => a.map(x => (x.innerText || '').trim() + ' ' + (x.getAttribute('href') || ''))).catch(() => []); await shot('N1-09-crm-summarise-record'); }
// N1-10 pipeline suggestion
await newChat();
const s2 = page.locator(`${P} button`, { hasText: 'How is my pipeline this month?' });
if (await s2.count()) { await s2.first().click(); await waitReply(1); R.n110 = await lastReply(); await shot('N1-10-crm-pipeline'); }
return R;
