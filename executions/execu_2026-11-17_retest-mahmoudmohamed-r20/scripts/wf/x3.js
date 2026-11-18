eval(fs.readFileSync('wf/lib.js','utf8'));
const id=fs.readFileSync('../ledger.md','utf8').match(/2997 seq t2" ([0-9a-f-]{36})/)[1];
const ex=await execsRaw(id);return {id,ex:ex.map(e=>e.id+' '+e.evaluatedAt)};
