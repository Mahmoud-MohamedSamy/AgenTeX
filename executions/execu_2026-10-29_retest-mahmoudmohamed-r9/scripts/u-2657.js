// NDC-2657 (U1, CRM User): Settings menu — Permissions link shown? Direct URL /settings/security/permissions → normal no-access page or the raw "Missing required permission" text?
await page.goto(H + '/settings', { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=Security Control', { timeout: 200000 }); await sleep(4000);
const s = await text(); await shot('2657-1-settings-menu.png');
await page.goto(H + '/settings/security/permissions', { waitUntil: 'domcontentloaded', timeout: 150000 }); await sleep(9000);
const d = await text(); await shot('2657-2-direct-url.png');
return { menuHasPermissions: /\nPermissions\n/.test(s), menuHasProfiles: /\nProfiles\n/.test(s), rawText: /Missing required permission/i.test(d), page: (d.match(/(Access Denied|You don't have permission[^\n]{0,80}|Missing required permission[^\n]{0,80})/i) || [''])[0], url: page.url() };
