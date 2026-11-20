eval(fs.readFileSync('cr/lib.js','utf8'));const o={leads:{}};const LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',LL='bf971461-2edc-45f2-b6e4-6e180aa64288';
const lf=arr((await api('GET',`/modules/${LEADS}/fields?take=400`)).j?.data);o.lk=lf.filter(x=>x.apiName==='lookup').map(x=>[x.labels?.en,JSON.stringify(x.datatypeOptions)]);
// other modules with single lookup to Leads
const mods=arr((await api('GET','/modules?take=200')).j?.data);o.single=[];for(const m of mods){const f=arr((await api('GET',`/modules/${m.id}/fields?take=400`)).j?.data);for(const x of f)if(x.datatypeKey==='lookup'&&x.datatypeOptions?.target_module_id===LEADS)o.single.push([m.labels?.en,m.id,x.apiName,x.labels?.en]);}
return o;
