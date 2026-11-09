module.exports=async()=>{const R={};const id='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';
 const r=await api('GET','/desk/tickets/'+id);const d=r.j.data;const flat=(o,p='')=>Object.entries(o||{}).flatMap(([k,v])=>v&&typeof v==='object'&&!Array.isArray(v)?flat(v,p+k+'.'):[[p+k,Array.isArray(v)?'['+v.length+']':v]]);
 R.t1=flat(d).map(([k,v])=>k+'='+String(v).slice(0,40));
 const f=await api('GET','/modules/'+T+'/fields');R.fields=(f.j.data||[]).map(x=>x.apiName+(x.isSystemManaged?'(sys)':'')).join(' ');
 return R;};
