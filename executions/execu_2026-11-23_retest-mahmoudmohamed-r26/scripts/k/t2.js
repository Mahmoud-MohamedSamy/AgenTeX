const seen=new Map();let tp=1;for(let i=1;i<=tp&&i<=40;i++){const r=await api('GET','/modules/'+TK+'/records?page_size=100&page='+i);tp=r.j?.meta?.total_pages||tp;for(const x of arr(r.j))seen.set(x.id,((x.data||[]).find(f=>f.field==='status')||{}).value?.value||'?');}
const cnt={};for(const s of seen.values())cnt[s]=(cnt[s]||0)+1;return {n:seen.size,tp,cnt};
