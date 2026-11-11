await api('GET','/global-sets'); const tok=JSON.parse(fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/ee5ce062-762e-4ac6-9542-9a3078b2187e/scratchpad/crm/globalsets1111/tok-crm-ndc_staging_owner.json','utf8')).a;
const csv='First Name,Last Name,QA GS1111 R2\nQA GS1111,Imp Gold,Gold\nQA GS1111,Imp Bronze,Bronze\nQA GS1111,Imp Unknown,Platinum\n';
const fd=new FormData(); fd.append('file',new Blob([csv],{type:'text/csv'}),'qa-gs1111-import.csv');
const up=await fetch('https://staging-crm.taviportal.com/api/v1/modules/'+L+'/import',{method:'POST',headers:{authorization:'Bearer '+tok,'x-app-key':'crm','x-tenant-id':'a7a7a7a7-0000-0000-0000-000000000004'},body:fd}); const uj=await up.json().catch(()=>null);
const id=uj&&uj.data&&(uj.data.id||uj.data.import_id||uj.data.job_id); I.IMP=id; SAVE(); LED('import job '+id);
const f=await api('GET','/modules/'+L+'/import/'+id+'/fields'); const st=await api('GET','/modules/'+L+'/import/'+id);
fs.writeFileSync(RUN+'/out/import-1.json',JSON.stringify({up:uj,fields:f.j,status:st.j},null,1));
return {up:up.status, keys:uj&&uj.data&&Object.keys(uj.data), fields:SR(f)+' '+JSON.stringify(f.j&&f.j.data).slice(0,600), status:JSON.stringify(st.j&&st.j.data).slice(0,600)};
