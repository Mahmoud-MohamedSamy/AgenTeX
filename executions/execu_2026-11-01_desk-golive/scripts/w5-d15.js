await go('/analytics/dashboards/standard/overview', 14000); out.ov = (await mtxt()).match(/Data updated [^O]{0,30}|Open Tickets Now \d+/g);
await go('/analytics/dashboards/standard/ticket_status', 14000); out.ts = (await mtxt()).match(/Open Tickets Now \d+/g);
await page.getByRole('button', { name: 'Department scope' }).click(); await sleep(1500); out.scope = (await page.locator('[role=dialog], [role=menu], [role=listbox]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await page.keyboard.press('Escape');
await go('/tickets', 12000); out.tl = (await mtxt()).slice(0, 300);
return fin({ out });
