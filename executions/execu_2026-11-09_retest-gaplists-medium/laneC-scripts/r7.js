const tk=JSON.parse(await (await ctx.request.get(H+'/locales/en/desk-tickets.json?_v=mw9af257')).text());
const flat=(o,p,acc)=>{if(typeof o==='string')acc.push([p,o]);else if(o&&typeof o==='object')for(const k in o)flat(o[k],p?p+'.'+k:k,acc);return acc;};
const a=flat(tk,'',[]);
return {conv:a.filter(([k,v])=>/^tickets\.conversation\./.test(k)&&/sent|deliver|bounce|status|fail|queued|open|read|recipient/i.test(k+v)).map(x=>x.join(' = ').slice(0,120)).slice(0,40),
editor:a.filter(([k,v])=>/strike|inline|image|font|spell|cloud|drive/i.test(k+' '+v)&&/editor|composer|toolbar|format/i.test(k)).map(x=>x.join(' = ').slice(0,100)).slice(0,20)};
