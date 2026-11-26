await go('/settings');
await sleep(4000);
const t = await text();
await shot('P05-crm-signin');
const launcher = await page.locator('[data-testid="tia-launcher"]').count();
const picker = t.includes('Choose an organization');
let orgs = [];
if (picker) orgs = (await page.locator('button, [role=button], li').allInnerTexts()).map(s => s.trim()).filter(s => s && s.length < 60).slice(0, 20);
return { url: page.url().replace(/[?#].*/, ''), launcher, picker, orgs, head: t.slice(0, 300) };
