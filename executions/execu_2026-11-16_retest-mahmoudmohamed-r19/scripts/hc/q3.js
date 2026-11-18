const o={};
for (const [k,m] of [['con',CON],['acc','784400e1-4a2a-42c2-b4f3-7ca56e79828a'],['prod','95b45992-5beb-4f23-b619-e3ae0e304933']]) {
 const r = await api('GET', `/modules/${m}/records?pageSize=5`); 
 o[k] = (r.j?.data?.items||r.j?.data||[]).slice(0,5).map(x=>{const d={}; for(const f of (x.data||[])) if(/name|first|last/.test(f.field)) d[f.field]=f.value?.value; return [x.id, JSON.stringify(d)]}); o[k+'s']=r.s;
}
return o;
