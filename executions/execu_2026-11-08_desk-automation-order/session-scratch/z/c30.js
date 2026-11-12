async (page) => {
  eval(require('fs').readFileSync('C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/zapi.js', 'utf8').replace('async function zapi', 'globalThis.zapi = async function'));
  const D = '1475109000000426945', R = {};
  R.rule = (await zapi(page, 'DELETE', 'workflows/1475109000000570581')).s;
  for (const p of ['automationFieldUpdates/1475109000000570567', 'workflowFieldUpdates/1475109000000570567', 'fieldUpdates/1475109000000570567']) { const x = await zapi(page, 'DELETE', p); R[p] = x.s; if (x.s < 300) break; }
  R.tickets = (await zapi(page, 'POST', 'tickets/moveToTrash', { ticketIds: ['1475109000000570515', '1475109000000570585', '1475109000000570637'] })).s;
  R.contact = (await zapi(page, 'POST', 'contacts/moveToTrash', { contactIds: ['1475109000000570478'] })).s;
  R.wfLeft = ((await zapi(page, 'GET', 'workflows?module=tickets&departmentId=' + D)).j.data || []).length;
  R.ticketGone = (await zapi(page, 'GET', 'tickets/1475109000000570585')).s;
  return R;
}
