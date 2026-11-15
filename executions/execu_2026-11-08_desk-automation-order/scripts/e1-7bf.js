eval(fs.readFileSync('lib-as.js','utf8'));const M=JSON.parse(fs.readFileSync('../e1.json','utf8'));
const out={};for(const [k,id] of [['ctl #3944',M.ctl],['bp #3935',M.t]]){const f=await feed(id);out[k]=f.reverse().map(e=>(e.occurred_at||e.created_at||'').slice(11,19)+' '+e.action).filter(x=>/mail|notif|clos|status|blueprint_left/i.test(x));}
return out;
