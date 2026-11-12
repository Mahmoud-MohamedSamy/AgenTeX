async (page) => {
  eval(require('fs').readFileSync('C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/zapi.js', 'utf8').replace('async function zapi', 'globalThis.zapi = async function'));
  const g = await zapi(page, 'GET', 'workflows/1475109000000570581');
  return JSON.stringify(g.j).slice(0, 2500);
}
