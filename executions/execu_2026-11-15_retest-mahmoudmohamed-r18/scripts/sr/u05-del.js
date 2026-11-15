const out = {};
await go('/settings/modules-and-fields/' + MID, 8000);
await page.getByRole('tab', { name: /^Fields/ }).first().click(); await sleep(3000);
await page.getByRole('button', { name: /Create and Edit Fields/ }).click(); await sleep(8000);
out.url = page.url();
const t = await bodyText(); out.hasUnused = /Unused/i.test(t); out.snip = (t.match(/.{0,200}Unused.{0,400}/i) || [''])[0];
await shot('2935-1-editor.png');
return out;
