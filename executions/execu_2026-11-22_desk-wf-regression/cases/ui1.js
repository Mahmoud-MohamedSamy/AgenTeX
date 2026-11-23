// UI pass 1: rules list, editor views of saved QA rules, new-rule trigger panel, history page, actions page.
const out = {};
await go('/settings/automation/workflow-rules'); await sleep(6000);
if (/sign in|log in/i.test((await text()).slice(0, 400))) return { signedOut: true };
await shot('L01-list');
const t = await text();
out.list = { hasHeading: /Workflow Rules/.test(t), cols: ['Name', 'Module', 'Departments', 'Trigger', 'Mode', 'Actions', 'Status', 'Updated'].filter(c => t.includes(c)), tabs: ['Active', 'Inactive', 'All'].filter(c => t.includes(c)), usage: (t.match(/\d+ of \d+ rules used[^\n]*/) || [''])[0], hasHistoryLink: /Execution History|Executions/i.test(t) };
// search
const s = page.getByPlaceholder(/Search rules/i); if (await s.count()) { await s.first().fill('QA WF COP1'); await sleep(2500); out.search = (await text()).includes('QA WF COP1'); await shot('L02-search'); await s.first().fill('zzzz-no-match'); await sleep(2000); out.searchEmpty = /No matching rules/i.test(await text()); await shot('L02-search-empty'); await s.first().fill(''); }
// how many rows / paging
await sleep(2000); const bodyT = await text(); out.pagingHint = (bodyT.match(/(\d+)\s*[–-]\s*(\d+)\s*of\s*(\d+)/) || [''])[0] || (bodyT.match(/Showing[^\n]*/) || [''])[0];
out.rowsVisible = await page.locator('tbody tr').count();
// trigger column text for some rules
for (const n of ['QA WF TEmulti', 'QA WF TDbefore', 'QA WF TF04', 'QA WF AC1']) { await s.first().fill(n); await sleep(2200); const row = page.locator('tbody tr').first(); out['row ' + n] = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); }
await s.first().fill('QA WF TEmulti'); await sleep(2000); await shot('L05-trigger-col');
return out;
