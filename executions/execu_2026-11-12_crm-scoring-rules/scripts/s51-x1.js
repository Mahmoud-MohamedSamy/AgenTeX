const L=await modId('leads'); const OUT=RUN+'/out'; await delAllQA();
let r=await mkRule(L,{name:P+'X1 web',entries:[ent('lead_source','eq','web',10),ent('industry','eq','technology',5)]}); keepRule(r);
r=await mkRule(L,{name:P+'X1 junk',entries:[ent('rating','eq','market_failed',-20)]}); keepRule(r);
const rows=[['A','web','technology',''],['B','web','technology',''],['C','web','',''],['D','web','technology','market_failed'],['E','chat','technology',''],['F','chat','','']];
const csv=['First Name,Last Name,Lead Source,Industry,Rating'].concat(rows.map(x=>`${P}X1 ${x[0]},imp,${x[1]},${x[2]},${x[3]}`)).join('\n'); const file=OUT+'/import-X1.csv'; fs.writeFileSync(file,csv);
const up=await upload('/modules/'+L+'/import',file,'import-X1.csv'); const sid=up.j&&up.j.data&&(up.j.data.id||up.j.data.session_id); I.imp_X1=sid; SAVE();
await api('GET','/modules/'+L+'/import/'+sid+'/fields');
const map=[['First Name','first_name'],['Last Name','last_name'],['Lead Source','lead_source'],['Industry','industry'],['Rating','rating']];
await api('PUT','/modules/'+L+'/import/'+sid+'/mapping',{mode:'add',match_field_key:null,layout_id:null,mapping:map.map(([h,f])=>({header:h,field:f})),options:{skip_empty:true,replace_empty:null,notify_email:false,assign_to_user_id:null,trigger_automation:true,assignment_rule_id:null,manual_approval:false,default_tag_ids:[],duplicate_check_module_ids:[]}});
await api('POST','/modules/'+L+'/import/'+sid+'/validate'); await api('POST','/modules/'+L+'/import/'+sid+'/execute');
let st; for(let i=0;i<60;i++){await sleep(4000); st=await api('GET','/modules/'+L+'/import/'+sid); if(/complet|fail/i.test(String(st.j&&st.j.data&&st.j.data.status)))break;}
const m1=await newRec(L,{first_name:P+'X1 G',last_name:'manual',lead_source:'web',industry:'technology'}); const m2=await newRec(L,{first_name:P+'X1 H',last_name:'manual',lead_source:'chat',industry:'technology'});
const it=arr((await api('GET','/modules/'+L+'/records?q='+encodeURIComponent(P+'X1')+'&per_page=100')).j.data).filter(x=>JSON.stringify(x).includes(P+'X1'));
const got=it.map(x=>{const d=x.data||[];const g=f=>{const v=d.find(y=>y.field===f);return v&&v.value&&v.value.value;};return [String(g('first_name')).replace(P+'X1 ',''),g('score')];}).sort();
I.x1ids=it.map(x=>x.id); SAVE();
const exp={A:15,B:15,C:10,D:-5,E:5,F:0,G:15,H:5}; const wrong=got.filter(([k,s])=>exp[k]!==Number(s));
return {import:st&&st.j&&st.j.data&&st.j.data.status+' '+st.j.data.created_count, leads:got, wrong, hot:got.filter(([k,s])=>Number(s)>=15).map(x=>x[0])};
