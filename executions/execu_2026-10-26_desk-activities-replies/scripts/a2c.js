const id = 'e737a6af-b76a-41f9-8c13-ff5776f55870';
const toast = async () => (await page.$$eval('[data-sonner-toast], [role=status]', ts => ts.map(t => t.innerText.replace(/\s+/g, ' ')).join(' | ')).catch(() => ''));
await go(`/modules/${M.tasks}/records/${id}`, 9000);
const out = {};
try {
  await page.getByRole('button', { name: 'Comment actions' }).first().click({ timeout: 8000 }); await sleep(800);
  out.menu = await page.$$eval('[role=menuitem]', ms => ms.map(m => m.innerText.trim()));
  await page.getByRole('menuitem', { name: 'Edit' }).click(); await sleep(800);
  const ed = page.getByRole('textbox', { name: 'Edit comment' }); out.edCount = await ed.count();
  await ed.fill('QA ACT comment 2 edited'); await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(2500); out.editToast = await toast();
  out.afterEdit = ((await txt()).match(/QA ACT comment 2[^\n]*(\n[^\n]*){0,2}/) || [''])[0];
  await page.getByRole('button', { name: 'Comment actions' }).first().click(); await sleep(800); await page.getByRole('menuitem', { name: 'Delete' }).click(); await sleep(1000);
  out.confirm = await page.$$eval('[role=alertdialog], [role=dialog]', ds => ds.map(d => d.innerText.replace(/\s+/g, ' ')).join(' | '));
  await page.locator('[role=alertdialog] button, [role=dialog] button').filter({ hasText: /^Delete$/ }).last().click(); await sleep(2500); out.delToast = await toast();
  out.after = ((await txt()).match(/Comments[\s\S]{0,40}/) || [''])[0]; out.noComments = (await txt()).includes('No comments yet.');
} catch (e) { out.err = String(e.message).slice(0, 200); out.shot = await shot('ACT-I2b-tavi'); }
return JSON.stringify(out);
