eval(fs.readFileSync('wf/lib.js','utf8'));
return (await execsRaw('dec00b32-c8a0-42c1-8dfa-10e64c4e576c')).map(e=>e.id);
