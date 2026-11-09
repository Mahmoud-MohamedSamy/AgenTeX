eval(require('fs').readFileSync('lib.js','utf8'));
const U=JSON.parse(fs.readFileSync('../out/hU.json','utf8')),WW=JSON.parse(fs.readFileSync('../out/hW.json','utf8'));const o={};
for(const [k,v] of [...Object.entries(U.res),...Object.entries(WW.res).map(([k,v])=>[k+'L',v])]){const t=await getT(v.id);o[k]=t.ticket_number||t.number||Object.keys(t).filter(x=>/num/.test(x)).map(x=>x+'='+t[x]).join();}
return o;
