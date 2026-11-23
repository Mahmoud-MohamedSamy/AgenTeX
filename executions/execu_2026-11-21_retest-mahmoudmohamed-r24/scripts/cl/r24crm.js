const LD='841043e1-c078-41f9-8d6e-dfd61bee45c3',RE=/QA RT24/;const o={del:{},fail:[]};
const val=x=>!x?undefined:x.kind==='array'?(x.items||[]).map(val):x.value;
const fl=x=>{const d=x.data||[];return Array.isArray(d)?Object.fromEntries(d.map(y=>[y.field,val(y.value)])):d;};
const D=async(k,m,p)=>{const r=await api(m,p);o.del[k]=r.s;if(r.s>=300&&r.s!==404)o.fail.push(k+' '+r.s+' '+String(r.t).slice(0,150));};
for(const q of ['/web-forms?app=crm','/web-forms']){const wf=arr((await api('GET',q)).j?.data).filter(f=>RE.test(f.name||''));for(const f of wf)if(!(('form '+f.name) in o.del))await D('form '+f.name,'DELETE','/web-forms/'+f.id);}
const out=[];for(let pg=1;pg<=3;pg++){const r=await api('GET','/modules/'+LD+'/records?page='+pg+'&per_page=100&sort_by=created_at&sort_dir=desc');const a=arr(r.j?.data);out.push(...a);if(a.length<100)break;}
const L=out.filter(x=>{const f=fl(x);return RE.test([f.first_name,f.last_name,f.full_name,x.display_name].join(' '));});o.leads=L.map(x=>x.id.slice(0,8));
for(const x of L)await D('lead '+x.id.slice(0,8),'DELETE','/modules/'+LD+'/records/'+x.id);
return o;
