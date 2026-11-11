// Find and delete QA AO tickets created today in QA AS6 Dept A (left by a failed delete).
eval(fs.readFileSync('lib-as.js','utf8'));const R={pages:0,found:[],del:{}};
for(let p=1;p<=40;p++){const r=(await api('GET','/modules/'+T+'/records?page='+p+'&page_size=100&sort=-created_at')).j?.data;const L=Array.isArray(r)?r:(r?.records||r?.items||[]);R.pages=p;if(!L.length)break;
 let old=0;for(const x of L){const o={};for(const d of (x.data||[])){o[d.field]=d.value?.value;}const c=x.created_at||o.created_at||'';if(c&&c<'2026-11-10')old++;
  if(/^QA AO /.test(o.subject||'')&&o.department===DA&&(!c||c>='2026-11-10'))R.found.push(x.id);}
 if(old===L.length)break;}
for(const id of R.found){const s=(await api('DELETE','/modules/'+T+'/records/'+id)).s;R.del[s]=(R.del[s]||0)+1;}
R.found=R.found.length;return R;
