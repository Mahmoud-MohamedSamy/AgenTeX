eval(fs.readFileSync('cr/lib.js','utf8'));const o={};
const mods=arr((await api('GET','/modules?take=200')).j?.data);
o.mods=mods.map(m=>[m.id,m.name||m.apiName||m.key,m.appKey||m.app_key||'',m.apiName||m.api_name||'']);
const want=m=>/^(calls|tasks|tickets|contacts|events|meetings)$/i.test(m.name||m.apiName||'');
for(const m of mods.filter(want)){const f=arr((await api('GET',`/modules/${m.id}/fields?take=400`)).j?.data);o['F_'+(m.name||m.apiName)]=f.filter(x=>x.required||x.isRequired||x.mandatory||/contact/i.test(x.apiName||x.key||x.name||'')).map(x=>[x.apiName||x.key||x.name,x.label||x.displayName,x.dataType||x.type,x.required??x.isRequired??x.mandatory,x.defaultValue!=null?'def':'' ]);}
save('d0',o);return {n:mods.length,mods:o.mods.slice(0,80),...Object.fromEntries(Object.entries(o).filter(([k])=>k.startsWith('F_')))};
