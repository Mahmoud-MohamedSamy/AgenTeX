eval(fs.readFileSync('w2/lib.js','utf8'));
const ex=await execsRaw('43102d58-3541-4d5e-a92d-1cbc4852197b');
return ex.slice(0,3).map(e=>({origin:e.origin,originName:e.originName,trig:e.triggerKind,corr:e.correlationId,sync:e.syncDurationMs,at:e.evaluatedAt,details:JSON.stringify(e.details).slice(0,600),disp:JSON.stringify(e.dispatches).slice(0,600)}));
