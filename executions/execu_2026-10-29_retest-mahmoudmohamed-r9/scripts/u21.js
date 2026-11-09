// NDC-2293: Audit Log › All Entities filter — options, search results, grouping, internal entries.
page.on('dialog', d => d.accept().catch(() => {}));
await go('/settings', 10000); await page.getByText('Audit Log', { exact: true }).first().click({ force: true }); await sleep(8000);
const f = page.getByRole('button', { name: /All Entities|Entities/i }).first(); await f.click({ force: true }); await sleep(2000); await shot('2293-01-entities');
const all = (await page.locator('[role=option], [role=listbox] li, [cmdk-item], [role=menuitemcheckbox], [role=treeitem]').allInnerTexts()).map(s => s.trim()).filter(Boolean);
const groups = (await page.locator('[role=group] [role=presentation], [cmdk-group-heading], [role=group] > div:first-child').allInnerTexts().catch(() => [])).map(s => s.trim()).filter(Boolean);
const inp = page.locator('[role=listbox] input, [cmdk-input], input[placeholder*="earch"]').last(); const found = {};
if (await inp.count()) for (const q of ['approval', 'blueprint', 'work', 'act', 'test', 'pin', 'preference', 'saved view']) { await inp.fill(q); await sleep(900); found[q] = (await page.locator('[role=option], [cmdk-item], [role=menuitemcheckbox], [role=treeitem]').allInnerTexts()).map(s => s.trim()).filter(Boolean); if (q === 'approval') await shot('2293-02-search-approval'); }
const dupes = all.filter((x, i) => all.indexOf(x) !== i);
return done({ n: all.length, dupes, groups: groups.slice(0, 20), all: all.slice(0, 80), found });
