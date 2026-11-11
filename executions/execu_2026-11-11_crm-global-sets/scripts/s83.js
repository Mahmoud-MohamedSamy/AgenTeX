const arrV=vals=>({kind:'array',items:vals.map(v=>({kind:'string',value:v}))}); const o={};
const mk=async(t,vals)=>{const x=await api('POST','/modules/'+L+'/records',{data:[{field:'first_name',value:enc('QA GS1111')},{field:'last_name',value:enc(t)},{field:'qa_gs1111_ms',value:arrV(vals)}]}); const id=x.j&&x.j.data&&(x.j.data.id||x.j.data.record&&x.j.data.record.id); if(id)LED('record '+t+' '+id); return [SR(x),id];};
const val=async id=>{const s=JSON.stringify((await api('GET','/modules/'+L+'/records/'+id)).j.data); const i=s.indexOf('"qa_gs1111_ms"'); return s.slice(i,i+200);};
// set values now: Red was replaced earlier -> check set state, restore for a clean test
let g=await gs(I.MSS); o.setStart=g.values.map(v=>v.value)+' | unused '+g.unused_values.map(v=>v.value);
await api('POST','/global-sets/'+I.MSS+'/values/restore',{values:g.unused_values.map(v=>v.value)}); g=await gs(I.MSS); o.setNow=g.values.map(v=>v.value).join(',');
const a=await mk('MS RedBlue',['Red','Blue']); const b=await mk('MS RedGreen',['Red','Green']); o.create=[a[0],b[0]]; I.MSR=[a[1],b[1]]; SAVE();
o.before=[await val(a[1]),await val(b[1])];
o.replace=SR(await api('POST','/global-sets/'+I.MSS+'/values/replace',{replacements:{Red:'Blue'}})); await sleep(2000);
o.afterReplace=[await val(a[1]),await val(b[1])];
o.remove=SR(await api('POST','/global-sets/'+I.MSS+'/values/remove',{values:['Green']})); o.afterRemove=await val(b[1]);
const ed=await api('PATCH','/modules/'+L+'/records/'+a[1],rec({last_name:'MS RedBlue edited'})); o.editA=SR(ed);
const u=await api('GET','/global-sets/'+I.MSS+'/used-in'); o.usedIn=JSON.stringify(u.j.data.fields.map(f=>f.field.field_name+':'+f.field.datatype_key));
fs.writeFileSync(RUN+'/out/multiselect-check.json',JSON.stringify(o,null,1)); return o;
