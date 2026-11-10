const dk=JSON.parse(await (await ctx.request.get(H+'/locales/en/desk.json?_v=mw9af257')).text());
const flat=(o,p,acc)=>{if(typeof o==='string')acc.push([p,o]);else if(o&&typeof o==='object')for(const k in o)flat(o[k],p?p+'.'+k:k,acc);return acc;};
return flat(dk,'',[]).filter(([k,v])=>/subject/i.test(k)&&/(channels|department|email)/i.test(k)).map(x=>x.join(' = ').slice(0,130)).slice(0,30);
