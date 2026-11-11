module.exports=async()=>{const R={};const v=await api('GET','/modules/'+T+'/views');const j=v.j&&v.j.data;const l0=Array.isArray(j)?j:(j&&(j.views||j.custom||j.items))||[];R.shape=Array.isArray(j)?'array':Object.keys(j||{}).join(',');
 const all=Array.isArray(j)?j:(j.views||[]);const l=all.filter(x=>x&&String(x.name).startsWith('QA MAN'));R.found=l.map(x=>x.name);
 for(const x of l){const d=await api('DELETE','/modules/'+T+'/views/'+x.id);LED('clean view "'+x.name+'" '+x.id+' '+d.s);R[x.name]=d.s;}
 const g=await api('GET','/modules/'+T+'/views/aa86e48f-0c26-419c-ad79-62910f7b8aba');if(g.s===200){const d=await api('DELETE','/modules/'+T+'/views/aa86e48f-0c26-419c-ad79-62910f7b8aba');R.direct=d.s;LED('clean view QA MAN view aa86e48f '+d.s);}else R.direct='gone '+g.s;return R;};
