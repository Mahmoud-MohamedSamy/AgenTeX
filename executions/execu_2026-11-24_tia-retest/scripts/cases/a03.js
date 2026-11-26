const R = {};
await go('/'); await sleep(5000);
R.a03 = { launcher: await page.locator('[data-testid="tia-launcher"]').count(), tiaEls: await page.locator('[data-testid^="tia"]').count(), url: page.url().replace(/[?#].*/, '') };
await shot('A-03-nop-no-launcher');
await go('/settings/integrations/tia'); await sleep(6000);
const t = await text();
R.a12 = { url: page.url().replace(/[?#].*/, ''), showsSetup: t.includes('Tia switch') || t.includes('Workspace allowance'), msg: t.split('\n').filter(l => /permission|access|not allowed|Manage AI|denied|can't|cannot/i.test(l)).slice(0, 5), edit: await page.locator('button', { hasText: /^Edit$/ }).count() };
await shot('A-12-nop-direct-url');
return R;
