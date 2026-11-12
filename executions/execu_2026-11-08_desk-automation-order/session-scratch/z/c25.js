async (page) => {
  eval(require('fs').readFileSync('C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/zapi.js', 'utf8').replace('async function zapi', 'globalThis.zapi = async function'));
  await new Promise(r => setTimeout(r, 30000));
  const out = {};
  for (const id of ['1475109000000570585', '1475109000000570515']) { const h = await zapi(page, 'GET', 'tickets/' + id + '/History?limit=20'); out[id] = (h.j.data || []).map(e => e.eventName + ' | ' + (e.actor && e.actor.type + ':' + e.actor.name)); }
  return out;
}
