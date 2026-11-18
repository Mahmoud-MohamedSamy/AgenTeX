const t1 = await mk(TM, 'ticket', 'QA GL TM menu 1', { subject: 'QA GL TM menu 1', department: MK, status: 'Open', email: 'qa-gl-tm-c1@example.com' });
const t2 = await mk(TM, 'ticket', 'QA GL TM menu 2', { subject: 'QA GL TM menu 2', department: MK, status: 'Open', email: 'qa-gl-tm-c1@example.com' });
out.t1 = t1; out.t2 = t2;
const g = await get(TM, t1.id); out.t1rec = JSON.stringify(g).slice(0, 700);
await go('/views/all/tickets/' + t1.id, 9000);
await page.getByRole('button', { name: /^Actions/ }).first().click(); await sleep(1500);
out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' | ');
await shot('tm/tavi-menu');
return fin({ out });
