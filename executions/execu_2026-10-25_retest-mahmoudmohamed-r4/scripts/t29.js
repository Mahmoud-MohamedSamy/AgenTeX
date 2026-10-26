const TS = 'c7bb126d-0c55-489f-8924-5fd6f2a98507';
const d = page.locator('[role=alertdialog],[role=dialog]').last();
const sel = d.locator('select'); if (await sel.count()) { const opts = await sel.locator('option').allInnerTexts(); await sel.selectOption({ label: 'Root (Without Folder)' }).catch(() => {}); } else { await d.getByText('Select folder').click().catch(() => {}); await sleep(500); await page.getByText('Root (Without Folder)', { exact: true }).last().click().catch(() => {}); }
await sleep(500); await shot('1692-04-move-root-chosen');
await d.getByRole('button', { name: /Move & Delete/ }).click(); await sleep(2500);
const pending = (await txt()).match(/Modules[\s\S]{0,300}Permissions/)?.[0];
await page.getByRole('button', { name: 'Save', exact: true }).last().click().catch(() => {}); await sleep(3500);
const folders = arr((await api('GET', `/teamspaces/${TS}/folders`)).j?.data).map(x => x.name);
const mods = arr((await api('GET', `/teamspaces/${TS}/modules`)).j?.data).map(x => (x.moduleKey || x.name) + ' folder=' + String(x.folderId || '-').slice(0, 8));
await shot('1692-05-after-delete');
return done({ pending, folders, mods });
