const o={}; I.LS=I.LS||[];
let n=arr((await api('GET','/global-sets?limit=200')).j.data).length; o.start=n;
let last=null;
for (let i=1; n<31 && i<40; i++) { const r=await api('POST','/global-sets',{name:'QA RT19 GS Lim '+String(i).padStart(2,'0'),description:'QA RT19 GS - safe to delete',values:[{label:'A'}]}); if (r.s<300) { I.LS.push(r.j.data.id); LED('set QA RT19 GS Lim '+i+' '+r.j.data.id); n++; SAVE(); } else { last=SR(r)+' at count '+n; break; } }
o.refused=last; o.end=arr((await api('GET','/global-sets?limit=200')).j.data).length; o.created=I.LS.length;
return o;
