const fs=require('fs');
const key=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g,'');
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy',P='efce4d84-5876-4015-b472-2efca7ad73f3';
const g=async u=>{const r=await fetch(u,{headers:{'X-API-Key':key}});if(!r.ok)throw new Error(r.status+' '+u);return r.json()};
const strip=h=>(h||'').replace(/<\/(p|li|h\d|tr|div)>/g,'\n').replace(/<\/t[dh]>/g,' | ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\n{2,}/g,'\n');
(async()=>{for(const n of [1978,2752,2811,2812,2813,2814,2821]){
 const it=await g(`${W}/work-items/NDC-${n}/?expand=state`);
 const c=await g(`${W}/projects/${P}/work-items/${it.id}/comments/?per_page=100`);
 const cs=(c.results||[]).sort((a,b)=>a.created_at.localeCompare(b.created_at));
 const l=cs[cs.length-1];
 console.log(`\n== NDC-${n} [${it.state.name}] ${it.name}\n  updated ${it.updated_at}; comments ${cs.length}`);
 if(n>=2811&&n<=2814) cs.slice(-2).forEach(x=>console.log('  --',x.created_at,'\n'+strip(x.comment_html).slice(0,1200)));
 else if(l) console.log('  last',l.created_at,strip(l.comment_html).slice(0,300));
}})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
