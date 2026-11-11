let all=[]; let cur=''; for (let p=0;p<6;p++){ const r = await api('GET','/audit/events?limit=200'+(cur?'&cursor='+encodeURIComponent(cur):'')); all=all.concat(arr(r.j&&r.j.data)); cur = r.j&&r.j.meta&&(r.j.meta.next_cursor||r.j.meta.nextCursor); if(!cur) break; }
const gs = all.filter(x => x.target_type==='global_set' || /global_set/.test(x.target_type||'') || /GS /.test(x.target_label||''));
const cnt={}; gs.forEach(x=>{cnt[x.action+' '+x.target_type]=(cnt[x.action+' '+x.target_type]||0)+1;}); log(all.length, cnt);
gs.slice(0,6).forEach(x=>log(x.action, x.target_type, x.target_label, JSON.stringify(x.changes).slice(0,300), JSON.stringify(x.metadata).slice(0,200)));
const ex = all.filter(x => JSON.stringify(x).includes('global_set')).slice(0,2); ex.forEach(x=>log('EX', x.action, x.target_type, x.target_label, JSON.stringify(x.changes).slice(0,400)));
