await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await sleep(3000);
const card = page.locator('[data-testid="tia-summary-card"]');
await card.locator('button', { hasText: /Deploy changes/ }).click(); await sleep(3000);
const R = { after: (await card.innerText()).replace(/\n+/g, ' / ').slice(0, 400), toasts: (await page.locator('[role=status], [role=alert], [data-sonner-toast], .toast').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300), dialog: (await page.locator('[role=dialog], [role=alertdialog]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300) };
await shot('B-' + process.env.MODE + '-deploy-clicked');
return R;
