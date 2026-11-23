// UI pass 2: condition value labels on saved rules, action picker on Delete / Date-Time / Ticket event rules, Test rule on a draft.
const out = {};
const R = { COP3: '9646b8f5-8dbb-4f9c-b34a-5b0e334ae96d', COO3: '89598f7d-96f2-46c3-a830-5d884d24466d', COL1: '8f3da883-10fa-48df-86e3-94e3dddda954', COU1: '0599bd8d-33f6-48e8-b999-d591820e3ecd', COG1: 'abc70630-7efd-455f-a869-69c88ccd46b8', TRD: 'bb4b69ae-a163-4dd8-91be-c0ee29c4bd53', TDbefore: '743ec9cd-dd8a-4887-b8a9-e9fbb18b4895', TEmulti: 'fbc10294-1d2e-4642-9791-9478eeafafc2' };
const uuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('workflow-rule-draft')) localStorage.removeItem(k); }).catch(() => {});
for (const k of ['COP3', 'COO3', 'COL1', 'COU1', 'COG1']) {
  await go('/settings/automation/workflow-rules/' + R[k]); await sleep(7000);
  const t = await text(); const cond = (t.split(/CONDITION|Condition/)[1] || t).slice(0, 600);
  out[k] = { summary: cond.replace(/\s+/g, ' ').slice(0, 260), uuidsShown: (cond.match(uuid) || []).length };
  await shot('CL10-' + k);
}
// action picker: open "Add action" on Delete / Date rule
for (const k of ['TRD', 'TDbefore', 'TEmulti']) {
  await go('/settings/automation/workflow-rules/' + R[k]); await sleep(7000);
  const add = page.getByRole('button', { name: /Add action/i }).first();
  if (await add.count()) { await add.click(); await sleep(1500); const menuT = await text(); await shot('MX-picker-' + k);
    const names = ['Field Update', 'Owner Assignment', 'Webhook', 'Email', 'Task', 'Create Record', 'Add Tags', 'Remove Tags', 'Send happiness email', 'Update related record', 'Add comment', 'Send email reply', 'Add followers', 'Mark as spam', 'Share ticket', 'Add skills', 'Remove skills', 'Recalculate skills', 'Reassign ticket based on skills', 'Change layout', 'Send Slack notification', 'Send Microsoft Teams notification', 'Send Google Chat notification', 'Reply via instant messaging', 'Notify via instant messaging', 'Function (custom action)'];
    out['picker ' + k] = names.filter(n => menuT.includes(n)); await page.keyboard.press('Escape'); }
  else out['picker ' + k] = 'no Add action button';
}
// Test rule on a draft (new rule)
await go('/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d'); await sleep(7000);
const fresh = page.getByRole('button', { name: /Start fresh/i }); if (await fresh.count()) { await fresh.first().click(); await sleep(1500); }
await shot('OB02-new-editor');
out.newEditor = (await text()).replace(/\s+/g, ' ').slice(0, 900);
const testBtn = page.getByRole('button', { name: /^Test( rule)?$/i }).first();
if (await testBtn.count()) { await testBtn.click(); await sleep(2000); const run = page.getByRole('button', { name: /Run test|Test$/i }).last(); await shot('OB02-test-panel'); if (await run.count()) { await run.click(); await sleep(4000); } await shot('OB02-test-result'); out.testDraft = (await text()).match(/(Criteria matched|Did not match|error[^\n]*|unexpected[^\n]*|went wrong[^\n]*)/i)?.[0] || 'no result text'; }
else out.testDraft = 'no Test button on new rule';
return out;
