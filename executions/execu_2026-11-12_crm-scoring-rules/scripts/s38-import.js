const L=await modId('leads'); const OUT=RUN+'/out'; await delAllQA();
const tag=process.env.TAG||'IMP'; const N=+(process.env.N||1000); const withRules=process.env.RULES!=='0';
if(withRules){ for(let k=0;k<5;k++){const r=await mkRule(L,{name:P+tag+' r'+k,entries:Array.from({length:10},(_,i)=>i===0?ent('lead_source','eq','web',10):ent('no_of_employees','gte',i*10+k,1))}); keepRule(r);} }
const csv=['First Name,Last Name,Lead Source,No. of Employees,Score'].concat(Array.from({length:N},(_,i)=>`${P}${tag},row${i},${i%2?'web':'chat'},${i%60},999`)).join('\n');
const file=OUT+'/import-'+tag+'.csv'; fs.writeFileSync(file,csv);
const t0=Date.now(); const up=await upload('/modules/'+L+'/import',file,'import-'+tag+'.csv'); const sid=up.j&&up.j.data&&(up.j.data.id||up.j.data.session_id||up.j.data.sessionId);
log('upload',up.s,sid?'sid ok':up.t.slice(0,300)); if(!sid) return;
I['imp_'+tag]=sid; SAVE();
const fl=await api('GET','/modules/'+L+'/import/'+sid+'/fields'); const fdata=fl.j&&fl.j.data; const flist=arr(fdata&&(fdata.fields||fdata.target_fields||fdata)); const keys=flist.map(f=>f.key||f.field_key||f.fieldName||f.api_name||f.name);
const scoreTarget=flist.find(f=>(f.field_name||f.key||f.fieldName)==='score');
log('fields',fl.s,'count',flist.length,'score mappable:',!!scoreTarget, 'sample keys',keys.slice(0,6).join(','), 'suggested', String(JSON.stringify(fdata)).slice(0,500));
const map=[['First Name','first_name'],['Last Name','last_name'],['Lead Source','lead_source'],['No. of Employees','no_of_employees']]; if(scoreTarget) map.push(['Score','score']);
const sm=await api('PUT','/modules/'+L+'/import/'+sid+'/mapping',{mode:'add',match_field_key:null,layout_id:null,mapping:map.map(([h,f])=>({header:h,field:f})),options:{skip_empty:true,replace_empty:null,notify_email:false,assign_to_user_id:null,trigger_automation:true,assignment_rule_id:null,manual_approval:false,default_tag_ids:[],duplicate_check_module_ids:[]}});
log('mapping',SR(sm).slice(0,300));
const va=await api('POST','/modules/'+L+'/import/'+sid+'/validate'); log('validate',SR(va).slice(0,300));
const ex=await api('POST','/modules/'+L+'/import/'+sid+'/execute'); log('execute',SR(ex).slice(0,200));
let st=null; for(let i=0;i<120;i++){await sleep(5000); st=await api('GET','/modules/'+L+'/import/'+sid); const s=st.j&&st.j.data&&(st.j.data.status||st.j.data.state); if(/complet|done|finish|fail|error|partial/i.test(String(s))) break;}
const dt=Date.now()-t0; const sd=st&&st.j&&st.j.data; log('status',String(JSON.stringify(sd)).slice(0,500),'ms',dt);
// read back via export pages
let rows=[]; for(let p=1;p<=Math.ceil(N/100)+2;p++){const e=await api('GET','/modules/'+L+'/records?q='+encodeURIComponent(P+tag)+'&per_page=100&page='+p); const it=arr(e.j&&e.j.data); it.filter(x=>JSON.stringify(x).includes(P+tag)).forEach(x=>{const d=x.data||[];const g=f=>{const v=d.find(y=>y.field===f);return v&&v.value&&v.value.value;};rows.push([g('lead_source'),g('score'),g('no_of_employees'),x.id]);}); if(it.length<100)break;}
I['impids_'+tag]=rows.map(r=>r[3]); SAVE();
const expScore=r=>(r[0]==='web'?50:0)+[0,1,2,3,4].reduce((a,k)=>a+Array.from({length:9},(_,i)=>(Number(r[2]||0)>=(i+1)*10+k)?1:0).reduce((x,y)=>x+y,0),0);
const wrong=rows.filter(r=>Number(r[1]||0)!==(withRules?expScore(r):0));
const bad=rows.filter(([src,sc])=>withRules?String(sc)!==String(src==='web'?(10+0):0)&&false:false);
fs.writeFileSync(OUT+'/import-'+tag+'-rows.json',JSON.stringify(rows.slice(0,50)));
return {tag,N,withRules,importMs:dt,readBack:rows.length,wrong:wrong.length,wrongSample:wrong.slice(0,3),sample:rows.slice(0,4).map(r=>r.slice(0,3)),scoreMappable:!!scoreTarget,scores999:rows.filter(r=>String(r[1])==='999').length};
