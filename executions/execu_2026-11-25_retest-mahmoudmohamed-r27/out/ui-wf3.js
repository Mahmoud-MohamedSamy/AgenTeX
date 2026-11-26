const o = {}; const R = [];
const pagerText = async () => (await page.getByText(/\d+\s*[–-]\s*\d+\s+of\s+\d+/).first().innerText().catch(() => 'none')).trim();
const pageOf = async () => ((await page.getByText(/Page \d+ of \d+/).first().innerText().catch(() => '')) || '').trim();
const rows = () => page.locator('tbody tr').count();
const names = async () => (await page.locator('tbody tr td:nth-child(2)').allInnerTexts()).map(s => s.trim());
const state = async label => { await sleep(1500); const s = { label, pager: await pagerText(), page: await pageOf(), rows: await rows(), url: page.url().replace(H, '') }; R.push(s); return s; };
const load = async (q = '') => { await page.goto(H + '/settings/automation/workflow-rules' + q, { waitUntil: 'commit' }); await page.locator('tbody tr').first().waitFor({ timeout: 120000 }); await sleep(1500); };
const sel = () => page.getByLabel('Rows per page');
const next = () => page.getByRole('button', { name: 'Next page' });
const prev = () => page.getByRole('button', { name: 'Previous page' });
await load(); await state('initial');
const p1 = await names();
await next().click(); const s2 = await state('next -> page 2'); const p2 = await names();
o.noOverlap_p1_p2 = !p1.some(n => p2.includes(n) && n.startsWith('QA RT27'));
await prev().click(); await state('previous -> page 1');
await sel().selectOption('100'); await state('rows per page 100');
await sel().selectOption('25'); await state('rows per page 25');
await sel().selectOption('50'); await state('rows per page 50');
for (let i = 0; i < 4; i++) await next().click(); const last = await state('next x4 -> last page');
o.nextDisabledOnLast = await next().isDisabled();
// collect all names across pages to check no duplicates / gaps
await load(); const allNames = []; for (let i = 0; i < 6; i++) { allNames.push(...await names()); if (await next().isDisabled()) break; await next().click(); await sleep(1500); }
o.walkCount = allNames.length; o.walkUnique = new Set(allNames).size;
// open a rule on page 2 and go back
await load(); await next().click(); await sleep(1500); const before = await state('page 2 before opening a rule');
await page.locator('tbody tr').first().locator('td').nth(1).click(); await sleep(3500); o.openedUrl = page.url().replace(H, '');
await page.goBack(); await page.locator('tbody tr').first().waitFor({ timeout: 60000 }); await state('back from rule');
// tabs
await page.getByText(/^Inactive/).first().click(); await state('Inactive tab');
await page.getByText(/^Active/).first().click(); await state('Active tab');
await page.getByText(/^All/).first().click(); await state('All tab');
// search with paging
await next().click(); await sleep(1200);
const sb = page.getByPlaceholder(/Search rules/); await sb.fill('QA RT27 list rule 1'); await state('search "QA RT27 list rule 1" (from page 2)');
await next().click().catch(() => {}); await state('search page 2');
await sb.fill(''); await sleep(1000);
// department filter
await page.getByText('All departments').first().click(); await sleep(800); await page.getByText('QA PA Dept 1', { exact: true }).last().click().catch(e => o.deptErr = String(e).slice(0, 80)); await state('department QA PA Dept 1');
await shot('3231-filtered');
// reload keeps page
await load('?page=3'); await state('open ?page=3 directly');
// 3232 Execution history button
await load(); const eh = page.getByRole('button', { name: /Execution history/i }).or(page.getByRole('link', { name: /Execution history/i })).first();
o.ehBox = await eh.boundingBox(); await shot('3232-header');
await eh.click(); await sleep(6000); o.ehUrl = page.url().replace(H, '');
o.ehText = (await page.locator('main').first().innerText().catch(() => '')).match(/Execution History[\s\S]{0,700}/)?.[0];
await shot('3232-execution-history');
o.states = R; return o;
