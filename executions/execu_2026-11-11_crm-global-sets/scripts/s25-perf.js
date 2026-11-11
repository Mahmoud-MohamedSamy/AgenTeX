const t=[]; for(let i=0;i<5;i++){const a=Date.now(); await api('GET','/global-sets'); t.push(Date.now()-a);} const d=[]; for(let i=0;i<5;i++){const a=Date.now(); await api('GET','/global-sets/'+I.Big); d.push(Date.now()-a);}
const med=x=>x.sort((a,b)=>a-b)[2];
RES('L6', med(t)<1000&&med(d)<1000?'Pass':'Fail','GET /global-sets median '+med(t)+' ms '+JSON.stringify(t)+'; GET 1000-value set median '+med(d)+' ms '+JSON.stringify(d)+' (target < 1 s)');
return 'ok';
