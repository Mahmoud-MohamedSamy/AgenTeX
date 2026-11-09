// Read-only: NDC-2275 details + comments from Plane. Key read by column, never printed.
const fs=require('fs'),path=require('path');
const key=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g,'');
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy',P='efce4d84-5876-4015-b472-2efca7ad73f3';
const g=async u=>{const r=await fetch(u,{headers:{'X-API-Key':key}});if(!r.ok)throw new Error(r.status+' '+u);return r.json()};
(async()=>{
 const it=await g(`${W}/work-items/NDC-2275/?expand=state,labels,assignees`);
 const c=await g(`${W}/projects/${P}/work-items/${it.id}/comments/?per_page=100`);
 const rel=await g(`${W}/projects/${P}/work-items/${it.id}/relations/`).catch(e=>({err:e.message}));
 const out=path.join(__dirname,'..','out');
 fs.writeFileSync(path.join(out,'2275-desc.html'),it.description_html||'');
 const strip=h=>(h||'').replace(/<\/(p|li|h\d|tr|div)>/g,'\n').replace(/<br\s*\/?>/g,'\n').replace(/<\/t[dh]>/g,' | ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\n{2,}/g,'\n');
 fs.writeFileSync(path.join(out,'2275-desc.txt'),strip(it.description_html));
 const cs=(c.results||[]).sort((a,b)=>a.created_at.localeCompare(b.created_at)).map(x=>`--- ${x.created_at} by ${x.created_by}\n${strip(x.comment_html)}`).join('\n');
 fs.writeFileSync(path.join(out,'2275-comments.txt'),cs);
 console.log(JSON.stringify({id:it.id,name:it.name,state:it.state&&it.state.name,priority:it.priority,labels:(it.labels||[]).map(l=>l.name||l),updated:it.updated_at,descChars:(it.description_html||'').length,comments:(c.results||[]).length,rel},null,1));
})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
