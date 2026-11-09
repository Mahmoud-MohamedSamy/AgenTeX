eval(require('fs').readFileSync('lib.js','utf8'));
const m=await api('GET','/modules');const flr=await api('GET','/modules/'+T+'/fields');
const mods=m.j.data.filter(x=>/contact|account|ticket/i.test(x.moduleKey+x.apiName)).map(x=>[x.id,x.moduleKey,x.apiName]);
const F=flr.j.data.filter(f=>/contact|account/i.test(f.apiName)).map(f=>[f.apiName,f.datatypeKey,JSON.stringify(f.datatypeOptions).slice(0,160)]);
return {mods,F};
