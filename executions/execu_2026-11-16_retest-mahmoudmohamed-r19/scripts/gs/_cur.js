// GS lane helpers (prepended by run.sh)
const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+'Z GS lane: '+m+'\n');
const RES=(id,verdict,fact)=>{fs.appendFileSync(RUN+'/out/gs/results.tsv',[new Date().toISOString().slice(11,19),id,verdict,String(fact).replace(/\s+/g,' ').slice(0,900)].join('\t')+'\n'); log(id+' '+verdict+' '+String(fact).slice(0,600));};
const E=r=>r&&r.j&&r.j.error?(r.j.error.code+': '+r.j.error.message):'';
const SR=r=>r.s+(E(r)?' '+E(r):'');
const IDS=RUN+'/out/gs/ids.json'; const I=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{}; const SAVE=()=>fs.writeFileSync(IDS,JSON.stringify(I,null,1));
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const enc=v=>({kind:'string',value:String(v)}); const rec=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
const gs=async id=>{const r=await api('GET','/global-sets/'+id); return r.j&&r.j.data;};
const recVal=async(mod,id,f)=>{const d=(await api('GET','/modules/'+mod+'/records/'+id)).j; const s=JSON.stringify(d&&d.data); const m=s&&s.match(new RegExp('"'+f+'","value":\{"kind":"[a-z_]+","value":"?([^"}]*)')); return m?m[1]:(s||'').slice(0,200);};
const mkRec=async(mod,t,v)=>{const x=await api('POST','/modules/'+mod+'/records',rec(Object.assign({first_name:'QA RT19 GS',last_name:t},v))); const id=x.j&&x.j.data&&(x.j.data.id||(x.j.data.record&&x.j.data.record.id)); if(id)LED('record '+t+' '+id+' (module '+mod.slice(0,8)+')'); return [x.s,id,id?'':x.t.slice(0,300)];};
const mkSetF=async(mod,name,setId,label)=>{const r=await api('POST','/modules/'+mod+'/fields',{fields:[{fieldName:name,labels:{en:label||name},datatypeKey:'pick_list',datatypeOptions:{global_set_id:setId},config:{}}]}); const d=r.j&&r.j.data; const id=d&&(Array.isArray(d)?d[0].id:(d.fields?d.fields[0].id:d.id)); if(id) LED('field '+name+' '+id+' (module '+mod.slice(0,8)+', set '+setId.slice(0,8)+')'); return {s:r.s,id,e:E(r),raw:id?undefined:r.t.slice(0,300)};};
const r=await api('GET','/modules/'+L+'/views'); const vs=arr(r.j.data); log(r.s, vs.length, Object.keys(r.j.data||{}).join(','));
const v=(await api('GET','/modules/'+L+'/views/'+I.V2)).j.data; log('mine',JSON.stringify(v).slice(0,900));
const any=vs.find(x=>x.settings&&x.settings.columns&&x.settings.columns.length); if(any) log('other',JSON.stringify(any.settings.columns).slice(0,500));
